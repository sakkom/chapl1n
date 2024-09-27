"use client"
import { useEffect, useState } from "react";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PublicKey } from "@solana/web3.js";
import { CollectionSearchResult } from "./user-page";
import { fetchUser, UserSet } from "../../anchorClient";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function TheaterInfo({wallet, collection} : {wallet: AnchorWallet, collection: PublicKey,}) {
  const [owners, setOwners] = useState<UserSet[]>([]); // 修正: owners ステートを追加

  useEffect(() => {
    const umi = createUmi(
      "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
    ).use(dasApi());

    async function fetchAllAssets() {
      const assets: CollectionSearchResult = await (
        umi.rpc as unknown as {
          getAssetsByGroup: (params: {
            groupKey: string;
            groupValue: PublicKey;
          }) => Promise<CollectionSearchResult>;
        }
      ).getAssetsByGroup({
        groupKey: 'collection',
        groupValue: collection,
      });
      console.log(assets);
      const ownersMap = new Map(); // 修正: 重複を避けるための Map を使用
       await Promise.all(
        assets.items.map(async (item) => {
          const owner = item.ownership.owner;
          if (!ownersMap.has(owner)) {
            const userProfile = await fetchUser(wallet, new PublicKey(owner));
            console.log(userProfile);
            ownersMap.set(owner, userProfile);
          }
          return ownersMap.get(owner);
        })
      );
      setOwners(Array.from(ownersMap.values())); // 修正: owners ステートを更新
    }

    fetchAllAssets(); // 修正: fetchAllAssets を呼び出す
  }, [wallet, collection]); // 修正: useEffect の依存配列に wallet と collection を追加
  
  return (
    <div>
      <h3>Owners:</h3>
      <ul>
        {owners.map((owner, index) => (
          <Link href={`/profile/${owner.userPda.toString()}`} key={index}>
          <li >{owner.userAccount.name}</li> 

          </Link>
        ))}
      </ul>
    </div>
  );
}