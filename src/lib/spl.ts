import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID, transfer, transferChecked } from '@solana/spl-token';

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
    const mint = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!);
    const tokenAccount = new web3.PublicKey(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT!);

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
      web3.LAMPORTS_PER_SOL * 100,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    return signature;

  } catch(e) {
    console.error(e);
  }
}

// export async function settlementFilm(payer: web3.Keypair, clientATA: string, treasury: web3.PublicKey, creators: string[], coCreators: string[]) {
//   try {
//     const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781", 'confirmed');
//     const MINT = new web3.PublicKey("H61GtPmCHYADu52F2rK6LL5oZGKuTJpxjYmdAtf53PLC");

//     const createATA = async (key: string) => {
//       const publicKey = new web3.PublicKey(key);
//       return await getOrCreateAssociatedTokenAccount(
//         connection,
//         payer,
//         MINT,
//         publicKey,
//         false,
//         { commitment: "confirmed" } as unknown as web3.Commitment,
//         undefined,
//         TOKEN_2022_PROGRAM_ID
//       );
//     };

//     for (const key of creators) {
//       const creatorATA = await createATA(key);
//       console.log("creatorATA", creatorATA.address.toBase58());
//     }

//     for (const key of coCreators) {
//       const coCreatorATA = await createATA(key);
//       console.log("coCreatorATA", coCreatorATA.address.toBase58());
//     }

//     const treasuryATA = await getOrCreateAssociatedTokenAccount(
//       connection,
//       payer,
//       MINT,
//       treasury,
//       true,
//       { commitment: "confirmed" } as unknown as web3.Commitment,
//       undefined,
//       TOKEN_2022_PROGRAM_ID
//     );

//     await transferChecked(
//       connection,
//       payer,
//       new web3.PublicKey(clientATA),
//       MINT,
//       carolAccount,
//       carol,
//       amountToTransfer,
//       decimals,
//       undefined,
//       undefined,
//       TOKEN_2022_PROGRAM_ID,
//     )
//     console.log("treasuryATA", treasuryATA.address.toBase58());
//   } catch(e) {
//     console.error(e);
//   }
// }


export async function createATA(payer: web3.Keypair, publicKey: web3.PublicKey) {
  try {
    const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781", 'confirmed');
    const MINT = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!);

    return await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      MINT,
      publicKey,
      true,
      { commitment: "confirmed" } as unknown as web3.Commitment,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
  } catch(e) {
    console.error(e);
  }
}


export async function transferPOP(delegate: web3.Keypair, from: web3.PublicKey, to: web3.PublicKey,  amount: bigint) {
  try {
    // const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781", 'confirmed');
    const connection = new web3.Connection("https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv", 'confirmed');
    const MINT = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!);

    return await transferChecked(
      connection,
      delegate,
      from,
      MINT,
      to,
      delegate.publicKey,
      amount,
      9,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    )
  } catch(e) {
    console.error(e);
  }
}