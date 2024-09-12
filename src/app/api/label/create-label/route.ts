import { createBubblegumTree } from "@/lib/bubblegum";
import { createMultisig } from "@/lib/squads";
import * as web3 from "@solana/web3.js";
import { connectLabel, createLabel } from "../../../../../anchorClient";
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

    console.log(initialMembers);
    console.log(initialMembers_pubKey);

    const multisigAccount = await createMultisig(initialMembers_pubKey); //変数のmemberにNodeWalletがついかされる。why?
    const squadId = multisigAccount.publicKey;

    const treeId = await createBubblegumTree();

    let tx
    if (squadId && treeId) {
      const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
      const wallet = new NodeWallet(keypair);
      const result = await createLabel(wallet, squadId, new web3.PublicKey(treeId));
      tx = result?.tx;

      const labelPda = result?.labelPda;

      const filteredMembers_pubKey = initialMembers_pubKey.filter(
        (pubKey) => !pubKey.equals(wallet.publicKey)
      );
      
      for (const member of filteredMembers_pubKey) {
        if (labelPda) {
          console.log(`Processing member: ${member.toString()}`);
          const tx = await connectLabel(wallet, member, labelPda);
          console.log("success", tx);
        } else {
          throw new Error("labelPda is undefined");
        }
      }
    }


    return new Response(JSON.stringify({ squadId, treeId, tx }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 400 });
  }
}