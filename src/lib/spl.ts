import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';


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