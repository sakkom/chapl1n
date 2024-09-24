import { getTreasury } from "@/lib/squads";
import { fetchLabel, Label } from "../../../../../anchorClient";
import {  PublicKey } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { createATA, transferPOP } from "@/lib/spl";

export async function POST(request: Request) {
  try {
    const nodeKeypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
    const nodeWallet = new NodeWallet(nodeKeypair);

    const formData = await request.formData();
    const clietnATA = formData.get('clientATA') as string;
    const creatorKeys = formData.getAll('creator') as string[];
    const coCreatorKeys = formData.getAll('coCreator') as string[];
    const label = formData.get('label') as string;
    const amountStr = formData.get('amount') as string;
    //Optional
    const historyOwner = formData.get('historyOwner') as string | null;
    const amount = BigInt(amountStr)
    console.log('clientATA', clietnATA);
    console.log("Creator Keys:", creatorKeys);
    console.log("Co-Creator Keys:", coCreatorKeys);
    console.log("label:", label);


    const labelData: Label = await fetchLabel(nodeWallet, new PublicKey(label));
    const treasury = await getTreasury(labelData.squadKey);

    if (!treasury) throw new Error("treasury not exist");

    console.log("treasury", treasury?.toBase58());


    const ratio = {
      treasury: !historyOwner ? BigInt(0.4 * 10 ** 9) : BigInt(0.3 * 10 ** 9),
      creators: BigInt(0.4 * 10 ** 9),
      coCreators: BigInt(0.2 * 10 ** 9),
      historyOwner: historyOwner ? BigInt(0.1 * 10 ** 9) : BigInt(0) // Always define historyOwner
    };

    const treasuryAmount = amount * ratio.treasury / BigInt(10 ** 9);
    const creatorsAmount = amount * ratio.creators / BigInt(10 ** 9);
    const coCreatorsAmount = amount * ratio.coCreators / BigInt(10 ** 9);
    const historyOwnerAmount =  historyOwner ? amount * ratio.historyOwner / BigInt(10**9) : null;

    console.log("amount", amountStr);
    console.log("treasuryAmount", treasuryAmount);
    console.log("creatorsAmount", creatorsAmount);
    console.log("coCreatorsAmount", coCreatorsAmount);
    if(historyOwnerAmount) console.log("historyOwnerAmount", historyOwnerAmount);


    const creatorsReceipt = [];
    for (const key of creatorKeys) {
      const creatorATA = await createATA(nodeKeypair, new PublicKey(key));
      const amount = creatorsAmount / BigInt(creatorKeys.length);
      if (creatorATA) {
        const sig = await transferPOP(nodeKeypair, new PublicKey(clietnATA), creatorATA.address, amount);
        creatorsReceipt.push({ sig, address: key, amount: amount.toString() });
        console.log('to Creator', sig);
      } else {
        throw new Error("Failed to create ATA for creator");
      }
    }

    const coCreatorsReceipt = [];
    for (const key of coCreatorKeys) {
      const coCreatorATA = await createATA(nodeKeypair, new PublicKey(key));
      const amount = coCreatorsAmount / BigInt(coCreatorKeys.length);
      if (coCreatorATA) {
        const sig = await transferPOP(nodeKeypair, new PublicKey(clietnATA), coCreatorATA.address, amount);
        coCreatorsReceipt.push({ sig, address: key, amount: amount.toString() });
        console.log('to CoCreator', sig);
      } else {
        throw new Error("Failed to create ATA for creator");
      }
    }

    let treasuryReceipt
    const treasuryATA = await createATA(nodeKeypair, treasury);
    if (treasuryATA) {
      const sig = await transferPOP(nodeKeypair, new PublicKey(clietnATA), treasuryATA.address, treasuryAmount);
      treasuryReceipt = { sig, address: treasury, amount: treasuryAmount.toString() }
      console.log('to treasury', sig);
    }

    let historyOwnerReceipt;
    if (historyOwner && historyOwnerAmount) {
      const historyOwnerATA = await createATA(nodeKeypair, new PublicKey(historyOwner));
      if (!historyOwnerATA) {
        throw new Error("Failed to create ATA for history owner");
      }
      const sig = await transferPOP(nodeKeypair, new PublicKey(clietnATA), historyOwnerATA.address, historyOwnerAmount);
      historyOwnerReceipt = { sig, address: historyOwner, amount: historyOwnerAmount.toString() };
    }


    return new Response(JSON.stringify({ creatorsReceipt, coCreatorsReceipt, treasuryReceipt, historyOwnerReceipt }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/film/settlement:", error);
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}