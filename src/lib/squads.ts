import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
} from "@sqds/sdk";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import BN from "bn.js";

export const initializeSquadsSDK = () => {
  const keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");
  const wallet = new NodeWallet(keypair);
  const connection = new web3.Connection( 'https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781', 'confirmed');

  const squads = new Squads({connection, wallet})

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

    return multisigAccount;
  } catch (error) {
    console.error("Failed to create multisig:", error);
    throw error;
  }
};

export const getMultisig = async (multisigPda: web3.PublicKey) => {
  try {
    const squads = initializeSquadsSDK();

    const multisigAccount = await squads.getMultisig(multisigPda);

    return multisigAccount;
  } catch (error) {
    console.error("Failed to get multisig:", error);
    throw error;
  }
};

export async function getTreasury(multisigPda: web3.PublicKey) {
  try {
    const [vault] = getAuthorityPDA(
      multisigPda,
      new BN(1),
      DEFAULT_MULTISIG_PROGRAM_ID,
    );

    return vault;

  } catch (e) {
    console.error(e)
  }
}

export const executeTx = async (txPda: web3.PublicKey) => {
  try {
    const squads = initializeSquadsSDK();

    const txState = await squads.executeTransaction(txPda);

    return txState;
  } catch (error) {
    console.error("Failed to get multisig:", error);
    throw error;
  }
};

