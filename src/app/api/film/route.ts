import { createFlyer, getMetadataUri } from "@/lib/metaplex";
import { getTreasury } from "@/lib/squads";
import * as web3 from "@solana/web3.js";
import { trnasferCollectionMint } from "@/lib/spl";
import { Actor, createFilm } from "../../../../anchorClient";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const flyer = formData.get('flyer') as File;
    // const msPda = formData.get('msPda') as string;
    // const actor = formData.get('actor') as Actor;
    const msPda = new web3.PublicKey("8XFNxHrabasXhLyUBc1FuGTfVXH7niWqvXa9hd29yXvs");
    const actor: Actor = { 
      creator: [ web3.Keypair.generate().publicKey, web3.Keypair.generate().publicKey], 
      coCreator: [web3.Keypair.generate().publicKey, web3.Keypair.generate().publicKey, web3.Keypair.generate().publicKey]
    }

    if (!flyer) {
      throw new Error("Flyer file is missing");
    }

    const uri = await getMetadataUri(flyer);
    console.log(uri);

    const collectionMint = await createFlyer(uri);
    console.log(collectionMint);

    if (!collectionMint) {
      throw new Error("Invalid collection mint");
    }

    const vault = await getTreasury(msPda);
    console.log(vault?.toString());

    if (!vault) {
      throw new Error("Invalid collection mint");
    }


    const collectionMintPubKey = new web3.PublicKey(collectionMint);
    const tx = await trnasferCollectionMint(vault, collectionMintPubKey);
    console.log(tx);

    const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
    const wallet = new NodeWallet(keypair);
    const sig = await createFilm(wallet, msPda, collectionMintPubKey, actor);

    return new Response(JSON.stringify({ vault, sig }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}