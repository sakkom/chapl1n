import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";

import { IDL, ChaplinProtocol } from "./idl";
import { Program } from "@coral-xyz/anchor";
// import { AnchorWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const USERSEED = "user-profile";
const LABELSEED = "label";

export type Actor = {
  creator: web3.PublicKey[],
  coCreator: web3.PublicKey[],
}

export const programId = new anchor.web3.PublicKey(
  "6ZGctGvY2YzjwJt5NB2rFsHueGC11ucmJo9chALDqxDX",
);

const connection = new web3.Connection(
  // "https://api.devnet.solana.com",
  // "https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv"
  "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
);

export function setProgram(wallet: NodeWallet | AnchorWallet) {
  try {
    console.log("Setting provider...");
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);
    // console.log(provider);

    const program = new Program<ChaplinProtocol>(IDL, provider);
    // console.log("Program created:", program);

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

    const tx = await program.methods
      .createLabel(squad_key, bubblegum_tree)
      .accounts({
        user: wallet.publicKey,
        squadKey: squad_key,
        label: labelPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();

    return { tx, labelPda }
  } catch (err) {
    console.error(err);
  }
}

export async function createFilm(
  wallet: NodeWallet,
  msPda: web3.PublicKey,
  collectionMint: web3.PublicKey,
  actor: Actor
) {
  try {

    const program = setProgram(wallet);
    if (!USERSEED) throw new Error("not USERSEED in env");

    const [labelPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(LABELSEED), msPda.toBytes()],
      program.programId,
    );

    const [filmPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("film"), collectionMint.toBuffer()],
      program.programId
    );

    console.log("user pda account", labelPda.toString());

    const instruction1 = await program.methods
      .createFilm(collectionMint, labelPda, actor)
      .accounts({
        user: wallet.publicKey,
        collectionMint: collectionMint,
        film: filmPda,
        label: labelPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction()

      const instruction2 = await program.methods
      .connectFilmToLabel(labelPda, filmPda)
      .accounts({
        user: wallet.publicKey,
        film: filmPda,
        label: labelPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction()

      const transaction = new web3.Transaction().add(instruction1, instruction2);
      const signature = await connection.sendTransaction(transaction, [wallet.payer]);

    return signature;
  } catch (err) {
    console.error(err);
  }
}

export async function connectLabel(
  wallet: NodeWallet,
  member: web3.PublicKey,
  labelPda: web3.PublicKey,
) {
  try {

    const program = setProgram(wallet);
    if (!USERSEED) throw new Error("not USERSEED in env");

    const [userPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(USERSEED), member.toBuffer()],
      program.programId,
    );
    console.log("foo", userPda);///9wDEo3MV4stNrFVad2FWCqRs8sDMbP6MuM23yZA3UZy7, 

    // user_profile アカウントが初期化されているか確認
    const userAccountInfo = await connection.getAccountInfo(userPda);
    if (!userAccountInfo) {
      throw new Error(`User profile account for member ${member.toString()} is not initialized`);
    }

    return await program.methods
      .connectLabelToUser(labelPda)
      .accounts({
        user: wallet.publicKey,
        userProfile: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();
  } catch (err) {
    console.error(err);
  }
}

//fetch
export async function fetchUser(wallet: AnchorWallet, authority: web3.PublicKey) {
  try {
    const program = setProgram(wallet);
    if (!USERSEED) throw new Error("USERSEEDが環境変数に設定されていません");

    const [userPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(USERSEED), authority.toBytes()],
      program.programId,
    );

    console.log("ユーザーPDA:", userPda.toString());
    console.log(program.account);

    const userAccount = await (program.account as any).userProfile.fetch(userPda);
    console.log("ユーザープロフィールアカウントデータ:", (userAccount as any).name);

    return {
      userAccount: userAccount as any,
      userPda: userPda
    };
  } catch (error) {
    console.error("ユーザーの取得中にエラーが発生しました:", error);
    throw error;
  }
}

export async function fetchLabel(wallet: AnchorWallet, labelPda: web3.PublicKey) {
  try {
    const program = setProgram(wallet);
    if (!USERSEED) throw new Error("USERSEEDが環境変数に設定されていません");

    const labelAccount = await (program.account as any).label.fetch(labelPda);

    return labelAccount;
  } catch (error) {
    console.error("ユーザーの取得中にエラーが発生しました:", error);
    throw error;
  }
}
