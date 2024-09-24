import { mintHistoryNFT, } from "@/lib/metaplex";
import { publicKey } from "@metaplex-foundation/umi";
import { pushHistory } from "../../../../../anchorClient";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { PublicKey } from "@solana/web3.js";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const client = formData.get('client') as string;
    const collectionMint = formData.get('collectionMint') as string;
    const merkleTree = formData.get('merkleTree') as string;

    console.log("視聴履歴を発行します");
    console.debug("Client:", client); 
    console.debug("Collection Mint:", collectionMint); 
    console.debug("Merkle Tree:", merkleTree); 

    const sig =  await mintHistoryNFT(publicKey(client), publicKey(collectionMint), publicKey(merkleTree));

    if(sig) {
      const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
      const wallet = new NodeWallet(keypair);
      await pushHistory(wallet, new PublicKey(client), new PublicKey(collectionMint));
    }
    
    return new Response(JSON.stringify({sig}), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}