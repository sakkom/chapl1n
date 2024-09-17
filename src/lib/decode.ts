import * as borsh from "@coral-xyz/borsh";
import * as web3 from "@solana/web3.js";
import Squads, { getTxPDA, DEFAULT_MULTISIG_PROGRAM_ID, getIxPDA } from "@sqds/sdk";
import { BN } from "bn.js";

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

export async function fetchTransactionStates(squads: Squads, msPda: web3.PublicKey, txIndex: number) {
  const txStates = [];
  for (let i = 1; i <= txIndex; i++) {
    const [txPda] = getTxPDA(msPda, new BN(i), DEFAULT_MULTISIG_PROGRAM_ID);
    const txState = await squads.getTransaction(txPda);
    txStates.push(txState);
  }
  return txStates;
}

//  CHECK: /anchorClient.tsのcreateFilmで作成したinstructionの解読
export async function fetchFilmInstructionStates(squads: Squads, txPda: web3.PublicKey, ixIndex: number) {
  const ixStates = [];
  
  for (let i = 1; i <= ixIndex; i++) {
    const [ixPda] = getIxPDA(txPda, new BN(i), DEFAULT_MULTISIG_PROGRAM_ID);
    const ixState = await squads.getInstruction(ixPda);

    // Decode the buffer data using the appropriate layout
    let decodedData;
    if (i === 1) {
      decodedData = createFilmLayout.decode(ixState.data);
      console.log(decodedData);
    } else if (i === 2) {
      decodedData = connectFilmLayout.decode(ixState.data);
      console.log(decodedData);
    }

    ixStates.push({ ixPda,  decodedData });
  }
  return ixStates;
}