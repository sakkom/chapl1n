import { initializeSquadsSDK } from "@/lib/squads";
import * as web3 from "@solana/web3.js";
import { getTxPDA, DEFAULT_MULTISIG_PROGRAM_ID, getIxPDA } from "@sqds/sdk";
import { BN } from "bn.js";
// import { MultisigAccount } from "@sqds/sdk";
import * as borsh from "@coral-xyz/borsh";
// import { publicKey, struct } from '@solana/buffer-layout-utils';
// import '@solana/buffer-layout-utils/lib/types';
// // import '@solana/buffer-layout-utils/lib/types/index.d.ts';
// import { u8, seq } from '@solana/buffer-layout';

const createFilmLayout = borsh.struct([
  borsh.array(borsh.u8(), 8, 'discriminator'),
  borsh.publicKey('collectionMint'),
  borsh.publicKey('label'),
  borsh.struct([
    borsh.vec(borsh.publicKey(), 'creator'),
    borsh.vec(borsh.publicKey(), 'coCreator')
  ], 'actor')
]);

const connectFilmLayout = borsh.struct([
  borsh.array(borsh.u8(), 8, 'discriminator'),
  borsh.publicKey('filmPda'),
  borsh.publicKey('relatedFilmPda')
]);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { ms } = data;

    const squads = initializeSquadsSDK();
    const msState = await squads.getMultisig(new web3.PublicKey(ms));
    const txCount = msState.transactionIndex;

    const txStates = [];
    for (let i = 1; i <= txCount; i++) {
      const [txId] = getTxPDA(new web3.PublicKey(ms), new BN(i), DEFAULT_MULTISIG_PROGRAM_ID);
      const txState = await squads.getTransaction(txId);

      const ixStates = [];
      for (let j = 1; j <= txState.instructionIndex; j++) {
        const [ixId] = getIxPDA(txId, new BN(j), DEFAULT_MULTISIG_PROGRAM_ID);
        const ixState = await squads.getInstruction(ixId);

        // Decode the buffer data using the appropriate layout
        let decodedData;
        if (j === 1) {
          decodedData = createFilmLayout.decode(ixState.data);
          console.log(decodedData);
        } else if (j === 2) {
          decodedData = connectFilmLayout.decode(ixState.data);
          console.log(decodedData);
        }

        ixStates.push({ ixId, ixState, decodedData });
      }

      txStates.push({ txId, txState, ixStates });
    }

    return new Response(JSON.stringify({ msState, txStates }), { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/film/filmTx:", err);
    return new Response("", { status: 400 });
  }
}
