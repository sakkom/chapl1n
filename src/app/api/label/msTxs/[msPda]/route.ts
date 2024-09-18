import { fetchFilmInstructionStates, fetchTransactionStates } from "@/lib/decode";
import { initializeSquadsSDK } from "@/lib/squads";
import * as web3 from "@solana/web3.js";

export async function GET(
  request: Request,
  { params }: { params: { msPda: string } },
) {
  try {
    console.log("Received multisigPda:", params.msPda); // デバッグログを追加

    if (!params.msPda) {
      return new Response(JSON.stringify({ error: 'multisigPda is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const msPda = new web3.PublicKey(params.msPda);

    const squads = initializeSquadsSDK();
    const msState = await squads.getMultisig(new web3.PublicKey(msPda));
    const txIndex = msState.transactionIndex;

    const txStates = await fetchTransactionStates(squads, msPda, txIndex);

    const createFilmTxs = [];
    for (const txState of txStates) {
      const instructionIndex = txState.instructionIndex; 
      const txPda = txState.publicKey; 
      const fetchedIxStates = await fetchFilmInstructionStates(squads, txPda, instructionIndex);
      createFilmTxs.push({txState, decodedDatas: fetchedIxStates});
    }
  
    return new Response(JSON.stringify({ createFilmTxs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch multisig data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}