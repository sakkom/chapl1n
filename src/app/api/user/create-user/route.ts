import { createUser } from "../../../../../anchorClient";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { authority, name } = data;

    console.log(authority, name);

    if (!authority || typeof authority !== "string") {
      throw new Error("権限が無効です");
    }
    if (!name || typeof name !== "string") {
      throw new Error("名前が無効です");
    }

    const authority_pubKey = new web3.PublicKey(authority);

    const private_key = process.env.NODEWALLET_PRIVATE_KEY || "";
    if (!private_key) throw new Error("not a private key");

    const keypair = web3.Keypair.fromSecretKey(bs58.decode(private_key));
    // console.log("Keypair public key:", keypair.publicKey.toBase58());
    const wallet = new NodeWallet(keypair);

    const tx = await createUser(wallet, authority_pubKey, name);

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    return new Response(JSON.stringify(tx), { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/user/create-user:", err);
    return new Response("", { status: 400 });
  }
}