import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import {  getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID, transfer } from '@solana/spl-token';


export async function trnasferCollectionMint(vault: web3.PublicKey, collectionMint: web3.PublicKey) {
  try {
    const nodeWallet = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");

    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      nodeWallet,
      collectionMint,
      nodeWallet.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      nodeWallet,
      collectionMint,
      vault,
      true
    );

    const signature = await transfer(
      connection,
      nodeWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      nodeWallet.publicKey,
      1,
      []
    );

    return signature
  } catch (e) {
    console.error(e);
  }
}

export async function airdropPopcorn(
  client: web3.PublicKey
) {
  try {
    const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781", 'confirmed');
    const mint = new web3.PublicKey("H61GtPmCHYADu52F2rK6LL5oZGKuTJpxjYmdAtf53PLC");
    const tokenAccount = new web3.PublicKey("54hkFbtFb2c7Yu7a3YBqsQPwkePbnwt7zxkgC2PEjG5G");

    const nodeWallet = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");


    const clientATA = await getOrCreateAssociatedTokenAccount(
      connection,
      nodeWallet,
      mint,
      client,
      false,
      { commitment: "confirmed" } as unknown as web3.Commitment,
      undefined,
      TOKEN_2022_PROGRAM_ID 
    );
    console.log("clientATA", clientATA);

    const signature = await transfer(
      connection,
      nodeWallet,
      tokenAccount,
      clientATA.address,
      nodeWallet.publicKey,
      web3.LAMPORTS_PER_SOL,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    return signature;

  } catch(e) {
    console.error(e);
  }
}
