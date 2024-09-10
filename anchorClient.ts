import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";

import { IDL, ChaplinProtocol } from "./idl";
import { Program } from "@coral-xyz/anchor";
// import { AnchorWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const USERSEED = "user-profile";
const LABELSEED = "label";

export const programId = new anchor.web3.PublicKey(
  "6ZGctGvY2YzjwJt5NB2rFsHueGC11ucmJo9chALDqxDX",
);

const connection = new web3.Connection(
  "https://api.devnet.solana.com",
);

export function setProgram(wallet: NodeWallet) {
  try {
    console.log("Setting provider...");
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);
    console.log(provider);

    const program = new Program<ChaplinProtocol>(IDL, provider);
    console.log("Program created:", program);

    return program;
  } catch (err) {
    console.error("Error in setProgram:", err);
    throw err;
  }
}

export function createProvider(
  wallet: NodeWallet /*connection: Connection*/,
) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  return provider;
}

export async function createUser(
  wallet: NodeWallet,
  authority: web3.PublicKey,
  name: string,
) {
  try {
    const provider = createProvider(wallet);
    const program = new Program<ChaplinProtocol>(IDL, provider);
    console.log("Program: ", program);
    if (!USERSEED) throw new Error("not USERSEED in env");

    const [userPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(USERSEED), authority.toBuffer()],
      program.programId,
    );
    console.log("user pda", userPda.toString());

    const transaction = await program.methods
      .createUser(name)
      .accounts({
        user: wallet.publicKey,
        authority: authority,
        userProfile: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const signature = await connection.sendTransaction(transaction, [wallet.payer]);
    console.log(`Transaction signature: ${signature}`);

    return signature;
  } catch (err) {
    console.error(err);
  }
}

export async function createLabel(
  wallet: NodeWallet,
  squad_key: web3.PublicKey, //pda?
  bubblegum_tree: web3.PublicKey //pda?
) {
  try {
    const program = setProgram(wallet);
    if (!USERSEED) throw new Error("not USERSEED in env");

    const [labelPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(LABELSEED), squad_key.toBytes()],
      program.programId,
    );
    console.log("user pda account", labelPda.toString());

    return await program.methods
      .createLabel(squad_key, bubblegum_tree)
      .accounts({
        user: wallet.publicKey,
        squadKey: squad_key,
        label: labelPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();
  } catch (err) {
    console.error(err);
  }
}