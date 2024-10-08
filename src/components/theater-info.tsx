"use client";
import { useEffect, useState } from "react";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PublicKey } from "@solana/web3.js";
import { CollectionSearchResult } from "./user-page";
import { fetchUser, UserSet } from "../../anchorClient";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Avatar from "boring-avatars";

export default function TheaterInfo({
  wallet,
  collection,
}: {
  wallet: AnchorWallet;
  collection: PublicKey;
}) {
  const [owners, setOwners] = useState<UserSet[]>([]);

  useEffect(() => {
    const umi = createUmi(
      "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
    ).use(dasApi());
    // console.log("collection",collection);
    async function fetchAllAssets() {
      try {
        const assets: CollectionSearchResult = await (
          umi.rpc as unknown as {
            getAssetsByGroup: (params: {
              groupKey: string;
              groupValue: PublicKey;
            }) => Promise<CollectionSearchResult>;
          }
        ).getAssetsByGroup({
          groupKey: "collection",
          groupValue: collection,
        });
        console.log("取得したアセット:", assets);

        const ownersMap = new Map();

        for (const item of assets.items) {
          const owner = item.ownership.owner;
          if (!ownersMap.has(owner)) {
            try {
              const userProfile = await fetchUser(wallet, new PublicKey(owner));
              ownersMap.set(owner, userProfile);
            } catch (error) {
              console.error("ユーザー取得エラー:", error);
            }
          }
        }

        const ownersArray = Array.from(ownersMap.values());
        console.log("最終的なowners:", ownersArray);
        setOwners(ownersArray);
      } catch (error) {
        console.error("fetchAllAssetsエラー:", error);
      }
    }

    fetchAllAssets();
  }, [wallet, collection]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-transparent text-white">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-4 text-white">Open Viewer</h3>
        <ul className="space-y-4">
          {owners.map((owner, index) => (
            <li key={index}>
              <Link href={`/profile/${owner.userPda.toString()}`}>
                <Card className="bg-white transition-all duration-300 ease-in-out hover:bg-gray-900 hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        name={`creator-${index}`}
                        colors={[
                          "#3fbbb7",
                          "#9945ff",
                          "#14f195",
                          "#5997cd",
                          "#7179e0",
                        ]}
                        variant="pixel"
                        size={50}
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {owner.userAccount.name}
                        </h2>
                        <p className="text-sm text-gray-200">
                          Open History: {owner.userAccount.history.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
