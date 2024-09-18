import * as web3 from "@solana/web3.js";
import { executeTx } from "@/lib/squads";

export async function POST(request: Request) {
  try {
    const txPda = await request.json();
    console.log(txPda);

    const txState = await executeTx(new web3.PublicKey(txPda));
    console.log(txState);

    return new Response(JSON.stringify({txState}), { status: 200 });
  } catch (err) {
    console.error("Error execute Tx ", err);
    return new Response("", { status: 400 });
  }
}