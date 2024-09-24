"use client";

import * as web3 from "@solana/web3.js";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {  getFilmPda, getUserProfile, UserProfile } from "../../anchorClient";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import UserCardV3 from "./user/user-card-vol3";
import { publicKey } from "@metaplex-foundation/umi";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useRouter } from "next/navigation"; 
import { HistoryNFT } from "@/lib/metaplex";

type CollectionSearchResult = {
  items: Array<HistoryNFT>,
  total: number,
}

export default function UserPage({userPda}: {userPda: web3.PublicKey}) {
  const [layout, setLayout] = useState("single");
  const [userAccount, setUserAccount] = useState<{
    userAccount: UserProfile;
    userPda: web3.PublicKey;
  } | null>(null);
  const [historyNFTs, setHistoryNFTs] = useState<HistoryNFT[]>([]);
  const wallet = useAnchorWallet();
  const router = useRouter(); 


  useEffect(() => {
    async function getUserData() {
      if (!wallet) return;
        const data = await getUserProfile(wallet, userPda);
        if (data) setUserAccount(data);
    }
    getUserData();
  }, [userPda, wallet]);

  const umi = createUmi(
    "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
  ).use(dasApi());

  useEffect(() => {
    const fetchAsset = async () => {
      if (wallet && userAccount) {
        // const user = await fetchUser(wallet, wallet.publicKey);
        const userHistory = userAccount?.userAccount.history || []
        
        const allResults = await Promise.all(
          userHistory.map(async (historyMint: web3.PublicKey) => {
            const result = await (umi.rpc as unknown as { searchAssets: (params: { owner: string, grouping: string[] }) => Promise<CollectionSearchResult> }).searchAssets({
              owner: publicKey(userAccount?.userAccount.authority),
              grouping: ["collection", historyMint.toBase58()],
            });
            // console.log("result", result);
            if(result.items) {
              const item: HistoryNFT = result.items[0];
              const uriData = await fetch(item.content.json_uri).then(res => res.json());
              const collectionMint = new web3.PublicKey(item.grouping[0].group_value)
              const filmPda = await getFilmPda(wallet, collectionMint);
              return { ...item, image: uriData.image, filmPda };
            }
            return undefined;
          })
        );

        const filteredResults = allResults.filter((item) => item !== undefined) as HistoryNFT[];
        // console.log("search your have collection nft", filteredResults);
        setHistoryNFTs(filteredResults);
      }
    };
    fetchAsset();
  }, [wallet, userAccount]);

  const renderItems = (items: web3.PublicKey[]) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Card key={index}>
          <Link href={`/label/${item.toBase58()}`}>
            <CardContent
              className={`p-4 ${
                layout === "single"
                  ? "flex items-center space-x-4"
                  : "space-y-3"
              }`}
            >
              <div
                className={`${
                  layout === "single" ? "w-1/3" : "w-full"
                } aspect-square`}
              >
                <Image
                  src="/radar.jpg"
                  alt={`Label ${index + 1} image`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  layout === "single" ? "flex-1" : "text-center"
                }`}
              >
                {item.toBase58().slice(0, 8)}...
              </h3>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );

  const renderHistoryItems = (items: HistoryNFT[]) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent
            className={`p-4 ${
              layout === "single" ? "flex items-center space-x-4" : "space-y-3"
            }`}
          >
            <div
              className={`${
                layout === "single" ? "w-1/3" : "w-full"
              } aspect-square`}
            >
              <img
                src={item.image}
                alt={`image`}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h3
              className={`text-lg font-semibold ${
                layout === "single" ? "flex-1" : "text-center"
              }`}
            >
              FILM HISTORY
            </h3>
            <Button onClick={() => router.push(`/theater/${item.filmPda.toString()}/${item.id}`)}>
              film view
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {userPda ? (<UserCardV3 wallet={wallet || null} userPda={userPda} />) : (<UserCardV3 wallet={wallet || null} />)}

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="label">ラベル</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="label">
          <div className="mb-4 flex justify-end space-x-2">
            <Button
              variant={layout === "single" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("single")}
              aria-label="1列表示"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "double" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("double")}
              aria-label="2列表示"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          {userAccount ? (
            renderItems(userAccount.userAccount.label)
          ) : (
            <p>Loading labels...</p>
          )}
        </TabsContent>
        <TabsContent value="history">
          <div className="mb-4 flex justify-end space-x-2">
            <Button
              variant={layout === "single" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("single")}
              aria-label="1列表示"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "double" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("double")}
              aria-label="2列表示"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          {historyNFTs.length > 0 ? (
            renderHistoryItems(historyNFTs)
          ) : (
            <p>Loading history...</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}