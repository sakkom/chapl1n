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
  borsh.publicKey('label'),
  borsh.publicKey('filmPda')
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
  const validDiscriminators = {
    createFilm: [28, 13, 137, 220, 225, 114, 22, 2],
    connectFilm: [110, 211, 169, 38, 176, 232, 78, 50]
  };

  
  
  const decodedData = []
  for (let i = 1; i <= ixIndex; i++) {
    const [ixPda] = getIxPDA(txPda, new BN(i), DEFAULT_MULTISIG_PROGRAM_ID);
    const ixState = await squads.getInstruction(ixPda);

    
    if (i === 1) {
      const data = createFilmLayout.decode(ixState.data);
      if (JSON.stringify(data.discriminator) !== JSON.stringify(validDiscriminators.createFilm)) {
        throw new Error('Invalid discriminator for createFilm');
      }
      decodedData.push(data)
    } else if (i === 2) {
      const data = connectFilmLayout.decode(ixState.data);
      if (JSON.stringify(data.discriminator) !== JSON.stringify(validDiscriminators.connectFilm)) {
        throw new Error('Invalid discriminator for connectFilm');
      }
      decodedData.push(data);
    }

  }

  return {txPda, decodedData};
}