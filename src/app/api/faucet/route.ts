import * as web3 from "@solana/web3.js";
import { airdropPopcorn } from "@/lib/spl";

export async function POST(request: Request) {
  try {
    const client = await request.json();
    console.log(client);

    const signature = await airdropPopcorn(new web3.PublicKey(client));
    console.log(signature);


    return new Response(JSON.stringify({signature}), { status: 200 });
  } catch (err) {
    console.error("Error execute Tx ", err);
    return new Response("", { status: 400 });
  }
}