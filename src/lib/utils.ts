"use client"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as web3 from "@solana/web3.js";
import { fetchAllDigitalAssetByOwner, fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {  publicKey } from '@metaplex-foundation/umi';
import Squads, { Wallet } from "@sqds/sdk";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchUser } from "../../anchorClient";


export type Flyer = {
  filmPda: web3.PublicKey
  collectionMint: web3.PublicKey,
  name: string,
  image: string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NODE_WALLET_PUBLIC_KEY = "HC7xyZvuwMyA6CduUMbAWXmvp4vTmNLUGoPi5xVc3t7P";

export function filterNodeWallet(keys: string[]): string[] {
  // console.log("Original keys:", keys);
  const filteredKeys = keys.filter(key => {
    try {
      return key !== NODE_WALLET_PUBLIC_KEY;
    } catch (error) {
      console.error(`無効な公開鍵: ${key}`, error);
      return false;
    }
  });
  // console.log("Filtered keys:", filteredKeys);
  return filteredKeys;
}

//client
export async function fetchFlyer(mint: web3.PublicKey, filmPda: web3.PublicKey) {
  try {
    
  const umi = createUmi('https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781')
    const data = await fetchDigitalAsset(umi, publicKey(mint))
    const uri = data.metadata.uri.replace("https://arweave.net", "https://devnet.irys.xyz");
    const name = data.metadata.name;

    const result = await fetch(uri);
    const uriData = await result.json(); 

    const flyer: Flyer = {
      filmPda,
      collectionMint: mint,
      name: name,
      image: uriData.image
    }

    return flyer
  } catch(e) {
    return {
      filmPda: "",
      collectionMint: mint,
      name: "Unknown",
      image: ""
    };
  }
}

export async function fetchMasterCopy(vault: web3.PublicKey) {
  try {
    
  const umi = createUmi('https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781')
    const data = await fetchAllDigitalAssetByOwner(umi, publicKey(vault))

    const masterCopies: string[] = data.map(asset => asset.publicKey);

    return masterCopies;
  } catch(e) {
    // return {
    //   collectionMint: mint,
    //   name: "Unknown",
    //   image: ""
    // };
  }
}

export async function approveTxUser(
  wallet:  AnchorWallet | Wallet,
  txPda: web3.PublicKey,
) {
  try {
    const squads = Squads.devnet(wallet as Wallet, { commitmentOrConfig: "confirmed" });
    const txState = await squads.approveTransaction(txPda);

    return txState;
  } catch (e) {
    console.error(e)
  }
}

export async function rejectTxUser(
  wallet: AnchorWallet | Wallet,
  txPda: web3.PublicKey,
) {
  try {
    const squads = Squads.devnet(wallet as Wallet, { commitmentOrConfig: "confirmed" });
    const txState = await squads.rejectTransaction(txPda);

    return txState;
  } catch (e) {
    console.error(e)
  }
}

export const validateMember = async (address: string, index: number, members: { address: string }[], wallet: AnchorWallet | null) => {
  if (members.some((member, i) => member.address === address && i !== index)) {
    return {
      isValid: false,
      name: "",
      pda: "",
      error: "おなじmemberは一度しか選択できません",
    };
  }
  try {
    new web3.PublicKey(address);
  } catch (e) {
    return {
      isValid: false,
      name: "",
      pda: "",
      error: "有効なaddressを入力してください",
    };
  }
  try {
    if (wallet) {
      const { userAccount, userPda } = await fetchUser(wallet, new web3.PublicKey(address));
      return {
        isValid: true,
        name: userAccount.name,
        pda: userPda.toString(),
        error: "",
      };
    } else {
      return {
        isValid: false,
        name: "",
        pda: "",
        error: "user アカウントがありません",
      };
    }
  } catch (e) {
    return {
      isValid: false,
      name: "",
      pda: "",
      error: "user アカウントがありません",
    };
  }
};