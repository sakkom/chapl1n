import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

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

    const multisigPda = new web3.PublicKey(params.msPda);

    const squads = initializeSquadsSDK();
  
    const multisigAccount = await squads.getMultisig(multisigPda);
  
    return new Response(JSON.stringify({ multisigAccount }), {
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