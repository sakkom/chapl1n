import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import Squads, { DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,} from "@sqds/sdk";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import BN from "bn.js";

export const initializeSquadsSDK = () => {
  const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
  const wallet = new NodeWallet(keypair);

  const squads = Squads.devnet(wallet);

  return squads;
};

export const getVault = (multisigPda: web3.PublicKey) => {
  if (!multisigPda) return null;
  // console.log(multisigPda);

  try {
    const [vault] = getAuthorityPDA(
      new web3.PublicKey(multisigPda),
      new BN(1),
      DEFAULT_MULTISIG_PROGRAM_ID,
    );

    return vault;
  } catch (error) {
    console.error("Failed to get vault:", error);
    return null;
  }
};

export const createMultisig = async (initialMembers: web3.PublicKey[]) => {
  try {
    ///CHECK: 
    const threshold = 1;

    const squads = initializeSquadsSDK();

    const createKey = web3.Keypair.generate().publicKey;

    const multisigAccount = await squads.createMultisig(
      threshold,
      createKey,
      initialMembers,
    );

    return  multisigAccount ;
  } catch (error) {
    console.error("Failed to create multisig:", error);
    throw error;
  }
};
