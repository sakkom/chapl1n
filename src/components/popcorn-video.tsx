"use client";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchLabel, fetchUser, Film, UserProfile } from "../../anchorClient";
import { postHisotyNFT, postSettlement } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Popcorn, Clock, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingPop from "@/components/loading-pop";
import Link from "next/link";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { publicKey } from "@metaplex-foundation/umi";
import { useQuery } from "@tanstack/react-query";
import { useClientPopcorn } from "@/ClientPopcornContext";
import { WideUser } from "./user/wide-user";
import Avatar from "boring-avatars";
import { fetchFlyer, Flyer } from "@/lib/utils";

type ViewReceipt = {
  creatorsReceipt: [{ sig: string; address: string; amount: string }];
  coCreatorsReceipt: [{ sig: string; address: string; amount: string }];
  treasuryReceipt: { sig: string; address: string; amount: string };
  historyOwnerReceipt?: { sig: string; address: string; amount: string };
};

interface PopcornVideoProps {
  videoUri: string;
  filmData: Film;
  clientATA: PublicKey;
  wallet: AnchorWallet;
  transferType: "Normal" | "History";
  historyOwner?: PublicKey;
  filmPda: PublicKey;
}

export default function PopcornVideo({
  videoUri,
  filmData,
  clientATA,
  wallet,
  transferType,
  historyOwner,
  filmPda,
}: PopcornVideoProps) {
  const [eatenPOP, setEatenPOP] = useState<number>(0);
  const [displayTokens, setDisplayTokens] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [receipt, setReceipt] = useState<ViewReceipt>();
  const [isLoading, setIsLoading] = useState(false);
  const [haveHistory, setHaveHistory] = useState<boolean>(false);
  const [historyOwnerAccount, setHistoryOwnerAccount] = useState<{
    userProfile: UserProfile;
    userPda: PublicKey;
  }>();
  const [flyer, setFlyer] = useState<Flyer>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const { refetchClientATAInfo } = useClientPopcorn();

  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: tree } = useQuery({
    queryKey: ["tree", wallet, filmData?.label],
    queryFn: async () => {
      if (!wallet || !filmData?.label) throw new Error("Missing dependencies");
      const labelData = await fetchLabel(wallet, filmData.label);
      return labelData.bubblegumTree;
    },
    enabled: !!wallet && !!filmData?.label,
  });

  useEffect(() => {
    async function getUserProfilePda() {
      if (!historyOwner) return;
      const result = await fetchUser(wallet, historyOwner);
      console.log(result);
      setHistoryOwnerAccount({
        userProfile: result.userAccount,
        userPda: result.userPda,
      });
    }
    getUserProfilePda();
  }, [historyOwner, wallet]);

  useEffect(() => {
    async function fetchFlyerData() {
      const flyer = await fetchFlyer(filmData.collectionMint, filmPda);
      setFlyer(flyer as Flyer);
    }

    fetchFlyerData();
  }, [filmData.collectionMint, filmPda]);

  useEffect(() => {
    const umi = createUmi(
      "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
    ).use(dasApi());
    async function checkHistory() {
      const result = await (
        umi.rpc as unknown as {
          searchAssets: (params: {
            owner: string;
            grouping: string[];
          }) => Promise<{ items: unknown[] }>;
        }
      ).searchAssets({
        owner: publicKey(wallet.publicKey),
        grouping: ["collection", filmData.collectionMint.toString()],
      });
      if (result.items.length > 0) {
        setHaveHistory(true);
      }
    }

    checkHistory();
  }, [wallet, filmData]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const updateProgress = () => {
      const currentTime = video.currentTime;
      const tokens = Math.floor(currentTime * 10 ** 9);
      const displayTokens = parseFloat((tokens / 10 ** 9).toFixed(2));
      setEatenPOP(tokens);
      setDisplayTokens(displayTokens);
      return tokens;
    };

    if (haveHistory) {
      video.addEventListener("loadedmetadata", updateDuration);
      video.addEventListener("timeupdate", updateProgress);

      return () => {
        video.removeEventListener("loadedmetadata", updateDuration);
        video.removeEventListener("timeupdate", updateProgress);
      };
    } else {
      const handleVideoEnd = async () => {
        const tokens = updateProgress();
        setIsLoading(true);
        if (transferType === "Normal") {
          try {
            const result = await postSettlement(
              clientATA.toString(),
              filmData.actor,
              filmData.label.toString(),
              tokens
            );
            setReceipt(result);
            refetchClientATAInfo();
          } catch (error) {
            console.error("Error in postSettlement:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (transferType === "History") {
          try {
            const result = await postSettlement(
              clientATA.toString(),
              filmData.actor,
              filmData.label.toString(),
              tokens,
              historyOwner?.toString()
            );
            setReceipt(result);
            refetchClientATAInfo();
          } catch (error) {
            console.error("Error in postSettlement:", error);
          } finally {
            setIsLoading(false);
          }
        }

        setIsVideoEnded(true);
        setIsPlaying(false);
      };

      video.addEventListener("loadedmetadata", updateDuration);
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("loadedmetadata", updateDuration);
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [
    clientATA,
    filmData,
    haveHistory,
    historyOwner,
    transferType,
    refetchClientATAInfo,
  ]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMint = async () => {
    setIsLoading(true);
    try {
      await postHisotyNFT(
        wallet.publicKey.toString(),
        filmData?.collectionMint.toString() || "",
        tree?.toString() || ""
      );
      setIsDialogOpen(false);
      setIsMinted(true);
      setHaveHistory(true);
    } catch (e) {
      console.error(e);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full xs:p-10">
      {transferType === "History" && historyOwnerAccount && (
        <Link href={`/profile/${historyOwnerAccount.userPda.toString()}`}>
          <div className="flex gap-2">
          <History className="text-[#14F195]" />
          <p>Resource</p>
          </div>

          <Card className="bg-black transition-all duration-300 ease-in-out hover:bg-gray-900 hover:shadow-md">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar
                  name={historyOwnerAccount.userProfile.name}
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
                    {historyOwnerAccount.userProfile.name}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      <Card className="w-full mx-auto overflow-hidden bg-black text-white shadow-lg rounded-t-none border border-[#14F195]">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            onClick={togglePlay}
            playsInline
          >
            <source src={videoUri} type="video/mp4" />
          </video>
          <Button
            className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-black rounded-full p-2"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            {isVideoEnded && receipt ? (
              <ReceiptDialog
                receipt={receipt}
                eatenPOP={eatenPOP}
                duration={duration}
                wallet={wallet}
                labelPda={filmData.label}
              />
            ) : haveHistory ? (
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2 text-[#14F195]">
                  Owned
                </h3>
              </div>
            ) : (
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2 text-[#14F195]">
                  Eaten:
                </h3>
                <span className="text-3xl font-bold text-white">
                  {displayTokens} 🍿
                </span>
              </div>
            )}
            {!haveHistory && !isMinted && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={!isVideoEnded}
                    className="bg-[#14F195] text-black hover:bg-[#0fd17e] transition-colors duration-200"
                  >
                    Mint
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black text-white border border-[#14F195]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4 text-[#14F195]">
                      Mint Confirmation
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg border-2 border-[#14F195]">
                      <img
                        src={flyer?.image}
                        alt="NFT Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center text-lg">
                      Are you sure you want to mint this NFT?
                    </p>
                    <div className="flex space-x-4 w-full">
                      <Button
                        onClick={() => setIsDialogOpen(false)}
                        variant="outline"
                        className="flex-1 bg-transparent text-[#14F195] border-[#14F195] hover:bg-[#14F195] hover:text-black transition-colors duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleMint}
                        className={`
                          flex-1 bg-[#14F195] text-black font-semibold
                          hover:bg-[#0fd17e]
                          focus:ring-2 focus:ring-[#14F195] focus:ring-offset-2 focus:ring-offset-black
                          transition-all duration-200 ease-in-out
                          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                        disabled={isLoading}
                      >
                        {isLoading ? "Minting..." : "Confirm Mint"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {isMinted && (
              <Button
                disabled
                className="bg-[#14F195] text-black opacity-50 cursor-not-allowed"
              >
                Minted
              </Button>
            )}
          </div>
          {isLoading && <LoadingPop />}
        </CardContent>
      </Card>
    </div>
  );
}

interface AccountCardProps {
  type: "Crew" | "Creator" | "Co-Creator" | "History";
  address: string;
  amount: string;
  sig: string;
  wallet?: AnchorWallet;
  labelPda?: PublicKey;
}

const AccountCard: React.FC<AccountCardProps> = ({
  type,
  address,
  amount,
  sig,
  wallet,
  labelPda,
}) => {
  const typeColors = {
    Crew: "bg-blue-900 text-blue-100",
    Creator: "bg-green-900 text-green-100",
    "Co-Creator": "bg-purple-900 text-purple-100",
    History: "bg-yellow-900 text-yellow-100",
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow bg-gray-800 border border-[#14F195]">
      <CardContent className="p-4">
        <a
          href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
          className="block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${typeColors[type]} font-medium`}>{type}</Badge>
            <span className="text-sm font-medium text-white">
              🍿 {amount} POP
            </span>
          </div>
          {/* <div className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-[#14F195]" />
            <p className="text-sm text-gray-300">{address}</p>
          </div> */}
          {wallet && (
            <WideUser wallet={wallet} authority={new PublicKey(address)} />
          )}
          {type === "Crew" && labelPda && (
            <>
              <Link href={`/label/${labelPda.toString()}`}>
                <Card className=" hover:bg-slate-800">
                  <CardContent className="flex items-center space-x-4 p-4 ">
                    <Avatar
                      name={type}
                      colors={[
                        "#3fbbb7",
                        "#9945ff",
                        "#14f195",
                        "#5997cd",
                        "#7179e0",
                      ]}
                      variant="pixel"
                      size={50}
                      square
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Production Team
                      </h2>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </a>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Sig:</span>
          <a
            href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
            className="text-xs text-[#14F195] hover:underline flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            {sig.slice(0, 6)}...{sig.slice(-4)}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
interface ReceiptDialogProps {
  receipt: ViewReceipt;
  eatenPOP: number;
  duration: number;
  wallet: AnchorWallet;
  labelPda: PublicKey;
}
const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  receipt,
  eatenPOP,
  wallet,
  labelPda,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-medium text-white border-[#14F195] hover:bg-[#14F195] hover:text-black transition-colors duration-200"
        >
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white sm:max-w-[90vw] md:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Receipt
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-200 flex items-center gap-2">
                  <Popcorn className="h-4 w-4" />
                  Popcorn Eaten
                </span>
                <span className="font-medium text-white">
                  🍿 {(Number(eatenPOP) / 10 ** 9).toFixed(2)} POP
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-200 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Total Duration
                </span>
                <span className="font-medium text-white">15 sec</span>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Accounts</h3>

              {receipt?.historyOwnerReceipt && (
                <AccountCard
                  type="History"
                  address={receipt.historyOwnerReceipt.address}
                  amount={(
                    Number(receipt.historyOwnerReceipt.amount) /
                    10 ** 9
                  ).toFixed(2)}
                  sig={receipt.historyOwnerReceipt.sig}
                  wallet={wallet}
                />
              )}

              <AccountCard
                type="Crew"
                address={receipt.treasuryReceipt.address}
                amount={(
                  Number(receipt.treasuryReceipt.amount) /
                  10 ** 9
                ).toFixed(2)}
                sig={receipt.treasuryReceipt.sig}
                // wallet={wallet}
                labelPda={labelPda}
              />

              {receipt.creatorsReceipt.map((creator, index) => (
                <AccountCard
                  key={index}
                  type="Creator"
                  address={creator.address}
                  amount={(Number(creator.amount) / 10 ** 9).toFixed(2)}
                  sig={creator.sig}
                  wallet={wallet}
                />
              ))}

              {receipt.coCreatorsReceipt.map((coCreator, index) => (
                <AccountCard
                  key={index}
                  type="Co-Creator"
                  address={coCreator.address}
                  amount={(Number(coCreator.amount) / 10 ** 9).toFixed(2)}
                  sig={coCreator.sig}
                  wallet={wallet}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};