import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity, generateSigner } from '@metaplex-foundation/umi';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createTree } from '@metaplex-foundation/mpl-bubblegum';
// import { base58 } from '@metaplex-foundation/umi-serializers';

export const initializeNodeUmi = () => {
  const umi = createUmi('https://api.devnet.solana.com')

  const web3Keypair = getKeypairFromEnvironment("NODEWALLET_PRIVATE_KEY");

  const keypair = umi.eddsa.createKeypairFromSecretKey(web3Keypair.secretKey);

  const signer = createSignerFromKeypair(umi, keypair);

  umi.use(signerIdentity(signer));

  return umi;
}

export const createBubblegumTree = async () => {
  const umi = initializeNodeUmi();

  try {
    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 14, // 16,384 
      maxBufferSize: 64,
      public: true,
    });

    await builder.sendAndConfirm(umi);

    // const { signature } = await builder.sendAndConfirm(umi);
    // const tx = base58.deserialize(signature)[0];

    return merkleTree.publicKey;
  } catch (error) {
    console.error('Error creating Bubblegum Tree:', error);
  }
};