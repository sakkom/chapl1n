import { useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { publicKey } from "@metaplex-foundation/umi";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { LayoutGrid, LayoutList, Clock, Popcorn } from "lucide-react";
import { getFilmPda, getUserProfile, UserProfile } from "../../anchorClient";
import UserCardV3 from "./user/user-card-vol3";
import { HistoryNFT } from "@/lib/metaplex";
import { useClientPopcorn } from "@/ClientPopcornContext";
import Link from "next/link";

export type CollectionSearchResult = {
  items: Array<HistoryNFT>;
  total: number;
};

export default function UserPage({ userPda }: { userPda: web3.PublicKey }) {
  const [layout, setLayout] = useState("single");
  const [userAccount, setUserAccount] = useState<{
    userAccount: UserProfile;
    userPda: web3.PublicKey;
  } | null>(null);
  const [historyNFTs, setHistoryNFTs] = useState<HistoryNFT[]>([]);
  const wallet = useAnchorWallet();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<HistoryNFT | null>(null);
  const { clientATAInfo } = useClientPopcorn();

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
        const userHistory = userAccount?.userAccount.history || [];

        const allResults = await Promise.all(
          userHistory.map(async (historyMint: web3.PublicKey) => {
            const result = await (
              umi.rpc as unknown as {
                searchAssets: (params: {
                  owner: string;
                  grouping: string[];
                }) => Promise<CollectionSearchResult>;
              }
            ).searchAssets({
              owner: publicKey(userAccount?.userAccount.authority),
              grouping: ["collection", historyMint.toBase58()],
            });
            if (result.items) {
              const item: HistoryNFT = result.items[0];
              const uriData = await fetch(item.content.json_uri).then((res) =>
                res.json()
              );
              const collectionMint = new web3.PublicKey(
                item.grouping[0].group_value
              );
              const filmPda = await getFilmPda(wallet, collectionMint);
              return { ...item, image: uriData.image, filmPda };
            }
            return undefined;
          })
        );

        const filteredResults = allResults.filter(
          (item) => item !== undefined
        ) as HistoryNFT[];
        setHistoryNFTs(filteredResults);
      }
    };
    fetchAsset();
  }, [wallet, userAccount]);

  const handleEnter = (filmPda: string, historyMint: string) => {
    router.push(`/theater/${filmPda}/${historyMint}`);
  };

  const renderHistoryItems = (items: HistoryNFT[]) => (
    <div
      className={`grid gap-6 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Dialog key={index} open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Card
              key={item.filmPda.toString()}
              className="overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105 bg-black text-white"
              onClick={() => setSelectedFilm(item)}
            >
              <CardHeader className="p-3 bg-gray-900">
                <CardTitle className="text-sm font-bold flex items-center text-white space-x-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>15sec</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={item.image}
                  alt={"img"}
                  className="w-full h-40 object-cover"
                />
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4 text-white">
                Admission Check
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-white" />
                <span>15 sec</span>
                <Popcorn className="h-5 w-5 text-white" />
                <span>15 POP</span>
              </div>
              <div className="grid gap-4 p-4 border-2 border-white rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Balance:</span>
                  <span className="font-bold text-lg">
                    🍿{" "}
                    {clientATAInfo
                      ? (Number(clientATAInfo.amount) / 10 ** 9).toFixed(4)
                      : "0"}{" "}
                    POP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Balance After Entry:</span>
                  <span className="font-bold text-lg">
                    🍿{" "}
                    {clientATAInfo
                      ? (
                          (Number(clientATAInfo.amount) - 15000000000) /
                          10 ** 9
                        ).toFixed(4)
                      : "0"}{" "}
                    POP
                  </span>
                </div>
              </div>
              {clientATAInfo && Number(clientATAInfo.amount) >= 15000000000 ? (
                <Button
                  className="w-full mt-2 bg-[#14F195] hover:bg-[#0fd584] text-gray-900"
                  size="lg"
                  onClick={() =>
                    selectedFilm && handleEnter(selectedFilm.filmPda.toString(), selectedFilm.id)
                  }
                >
                  Enter
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-red-400 mb-2">Insufficient POP</p>
                  <Button
                    className="w-full mt-2 bg-[#14F195] hover:bg-[#0fd584] text-gray-900 opacity-50 cursor-not-allowed"
                    size="lg"
                    disabled
                  >
                    Enter
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {userPda ? (
        <UserCardV3 wallet={wallet || null} userPda={userPda} />
      ) : (
        <UserCardV3 wallet={wallet || null} />
      )}

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
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
        <TabsContent value="crew">
          {userAccount?.userAccount.label && userAccount.userAccount.label.length > 0 ? (
            userAccount.userAccount.label.map((label, index) => (
              <Link href={`/label/${label.toString()}`} key={index}>
                <Card className="flex flex-col sm:flex-row items-center w-full max-w-2xl mx-auto overflow-hidden bg-white mb-4">
                  <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
                    <img
                      src="/gara.avif"
                      alt="制作チーム"
                      className="rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 w-full sm:w-2/3">
                    <h1 className="text-2xl font-bold text-primary mb-2">
                      Production team
                    </h1>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <p>クルーが見つかりません。</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
