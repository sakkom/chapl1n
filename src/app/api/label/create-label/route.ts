import { createBubblegumTree } from "@/lib/bubblegum";
import { createMultisig } from "@/lib/squads";
import * as web3 from "@solana/web3.js";
import { createLabel } from "../../../../../anchorClient";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";


interface createMultisigProps {
  initialMembers: string[];
}

export async function POST(request: Request) {
  try {
    const { initialMembers }: createMultisigProps = await request.json();

    const initialMembers_pubKey = initialMembers.map((member) => {
      try {
        return new web3.PublicKey(member);
      } catch (error) {
        throw new Error(`Invalid public key: ${member}`);
      }
    });

    const multisigAccount = await createMultisig(initialMembers_pubKey);
    const squadId = multisigAccount.publicKey;

    const treeId = await createBubblegumTree();

    let tx 
    if(squadId && treeId) {
      const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
      const wallet = new NodeWallet(keypair);
      tx = await createLabel(wallet, squadId, new web3.PublicKey(treeId));

      console.log(tx);
    }


    return new Response(JSON.stringify({ squadId, treeId, tx }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}