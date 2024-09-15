

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity, generateSigner, createGenericFileFromBrowserFile, percentAmount } from '@metaplex-foundation/umi';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createTree } from '@metaplex-foundation/mpl-bubblegum';
import { createNft, mplTokenMetadata,  } from '@metaplex-foundation/mpl-token-metadata'
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
// import { base58 } from '@metaplex-foundation/umi-serializers';

export const initializeNodeUmi = () => {
  const umi = createUmi(
    'https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781'
    // "https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv"
  )

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

export async function getMetadataUri(
  flyer: File,
) {
  const umi = initializeNodeUmi();
  umi.use(irysUploader({address: "https://devnet.irys.xyz"}));

  const genericFile = await createGenericFileFromBrowserFile(flyer, {
    contentType: flyer.type,
  });

  const [imageUri] = await umi.uploader.upload([genericFile]);
  console.log(imageUri);

  // https://gateway.irys.xyz/

  const uri = await umi.uploader.uploadJson({
    name: "Film PoP",
    description: "Generative art on Solana.",
    image: imageUri,
    animation_url: "",
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "Genre",
        value: "no genre",
      },
    ],
    properties: {
      file: [{ uri: imageUri }],
    },
  });

  return uri;

}

export async function createFlyer(uri: string) {
  try {
    const umi = initializeNodeUmi();
    umi.use(mplTokenMetadata())

    const collectionMint = generateSigner(umi);
    await createNft(umi, {
      mint: collectionMint,
      name: 'Film Pop',
      uri: uri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true,
    }).sendAndConfirm(umi);

    return collectionMint.publicKey;
  } catch(e) {
    console.error(e);
  }

}


