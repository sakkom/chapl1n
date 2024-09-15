import { createFlyer, getMetadataUri } from "@/lib/metaplex";
import { getTreasury, initializeSquadsSDK } from "@/lib/squads";
import * as web3 from "@solana/web3.js";
import { trnasferCollectionMint } from "@/lib/spl";
import { Actor, createFilm } from "../../../../anchorClient";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ActorForm } from "@/components/actors-form";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const flyer = formData.get('flyer') as File;
    const labelPda = formData.get('labelPda') as string;
    const msPda = formData.get('msPda') as string;
    const actorForm = JSON.parse(formData.get('actor') as string) as ActorForm;
    const actor: Actor = {
      creator: actorForm.creator.map(creator => new web3.PublicKey(creator)),
      coCreator: actorForm.coCreator.map(coCreator => new web3.PublicKey(coCreator))
    };

    if (!flyer) {
      throw new Error("Flyer file is missing");
    }

    const uri = await getMetadataUri(flyer);
    const collectionMint = await createFlyer(uri);

    if (!collectionMint) {
      throw new Error("Invalid collection mint");
    }

    const vault = await getTreasury(new web3.PublicKey(msPda));
    console.log('vault', vault);

    if (!vault) {
      throw new Error("Invalid collection mint");
    }

    const collectionMintPubKey = new web3.PublicKey(collectionMint);
    const tx = await trnasferCollectionMint(vault, collectionMintPubKey);
    console.log(tx);

    const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
    const wallet = new NodeWallet(keypair);
    const instructions = await createFilm(wallet, new web3.PublicKey(labelPda), collectionMintPubKey, actor);

    if (!instructions || instructions.length < 2) {
      throw new Error("Invalid instructions");
    }

    const [instruction1, instruction2] = instructions;

    const squads = initializeSquadsSDK();
    const transasction = await squads.createTransaction(new web3.PublicKey(msPda), 1);
    await squads.addInstruction(transasction.publicKey, instruction1);
    await squads.addInstruction(transasction.publicKey, instruction2);
    await squads.activateTransaction(transasction.publicKey);

    console.log(collectionMint);
    console.log('transaction pda', transasction.publicKey);
    return new Response(JSON.stringify({  transasction }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}