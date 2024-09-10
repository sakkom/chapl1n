// import { setProgram } from "../../../../../anchorClient";
import { createUser } from "../../../../../anchorClient";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";


export async function POST(reqest: Request) {
  try {
    const formData = await reqest.formData();
    const authority = formData.get("authority");
    const name = formData.get("name");

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
    console.log(keypair.publicKey);
    const wallet = new NodeWallet(keypair);

    const tx = await createUser(wallet, authority_pubKey, name);

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    return Response.json(tx);
  } catch (err) {
    console.error("not working add harigami collection");
    return new Response("", { status: 400 });
  }
}