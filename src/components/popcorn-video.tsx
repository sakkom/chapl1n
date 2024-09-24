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
import { ExternalLink, User, Popcorn, Clock, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingPop from "@/components/loading-pop";
import Link from "next/link";

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
}

export default function PopcornVideo({
  videoUri,
  filmData,
  clientATA,
  wallet,
  transferType,
  historyOwner,
}: PopcornVideoProps) {
  const [eatenPOP, setEatenPOP] = useState<number>(0);
  const [displayTokens, setDisplayTokens] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [receipt, setReceipt] = useState<ViewReceipt>();
  const [isLoading, setIsLoading] = useState(false);
  const [tree, setTree] = useState<PublicKey>();
  const [historyOwnerAccount, setHistoryOwnerAccount] = useState<{
    userProfile: UserProfile;
    userPda: PublicKey;
  }>();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchTree() {
      if (filmData?.label) {
        const labelData = await fetchLabel(wallet, filmData.label);
        const tree = labelData.bubblegumTree;
        setTree(tree);
      }
    }
    fetchTree();
  }, [filmData]);

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
  }, [historyOwner]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const updateProgress = () => {
      const currentTime = video.currentTime;
      const eatenAmount = currentTime / 60;
      const tokens = Math.floor(eatenAmount * 10 ** 9);
      const displayTokens = parseFloat((tokens / 10 ** 9).toFixed(3));
      setEatenPOP(tokens);
      setDisplayTokens(displayTokens);
      return tokens;
    };

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
  }, [clientATA, filmData]);

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

  // const formatTime = (time: number) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  const handleMint = async () => {
    try {
      await postHisotyNFT(
        wallet.publicKey.toString(),
        filmData?.collectionMint.toString() || "",
        tree?.toString() || ""
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {transferType === "History" && historyOwnerAccount && (
        <Link href={`/profile/${historyOwnerAccount.userPda.toString()}`}>
          <div className="flex">
            <History />
            <p>{historyOwnerAccount?.userProfile?.name || 'Unknown'}</p>
          </div>
        </Link>
      )}

      <Card className="w-full max-w-md mx-auto overflow-hidden bg-white text-black shadow-lg">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            onClick={togglePlay}
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
              />
            ) : (
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2">Eaten:</h3>
                <span className="text-3xl font-bold">{displayTokens} 🍿</span>
              </div>
            )}
            <Button disabled={!isVideoEnded} onClick={handleMint}>
              mint
            </Button>
          </div>
          {isLoading && <LoadingPop />}
        </CardContent>
      </Card>
    </>
  );
}

interface AccountCardProps {
  type: "Label" | "Creator" | "Co-Creator" | "History";
  address: string;
  amount: string;
  sig: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  type,
  address,
  amount,
  sig,
}) => {
  const typeColors = {
    Label: "bg-blue-100 text-blue-800",
    Creator: "bg-green-100 text-green-800",
    "Co-Creator": "bg-purple-100 text-purple-800",
    History: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <a
          href={`https://example.com/account/${address}`}
          className="block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${typeColors[type]} font-medium`}>{type}</Badge>
            <span className="text-sm font-medium">{amount} POP</span>
          </div>
          <div className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </a>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Sig:</span>
          <a
            href={`https://example.com/sig/${sig}`}
            className="text-xs text-blue-600 hover:underline flex items-center"
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
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  receipt,
  eatenPOP,
  duration,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-medium">
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className=" bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Receipt
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Popcorn className="h-4 w-4" />
                  Popcorn Eaten
                </span>
                <span className="font-medium text-gray-900">
                  {(Number(eatenPOP) / 10 ** 9).toFixed(9)} 🍿
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Total Duration
                </span>
                <span className="font-medium text-gray-900">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>

              {receipt?.historyOwnerReceipt && (
                <AccountCard
                  type="History"
                  address={receipt.historyOwnerReceipt.address}
                  amount={(
                    Number(receipt.historyOwnerReceipt.amount) /
                    10 ** 9
                  ).toFixed(9)}
                  sig={receipt.historyOwnerReceipt.sig}
                />
              )}

              <AccountCard
                type="Label"
                address={receipt.treasuryReceipt.address}
                amount={(
                  Number(receipt.treasuryReceipt.amount) /
                  10 ** 9
                ).toFixed(9)}
                sig={receipt.treasuryReceipt.sig}
              />

              {receipt.creatorsReceipt.map((creator, index) => (
                <AccountCard
                  key={index}
                  type="Creator"
                  address={creator.address}
                  amount={(Number(creator.amount) / 10 ** 9).toFixed(9)}
                  sig={creator.sig}
                />
              ))}

              {receipt.coCreatorsReceipt.map((coCreator, index) => (
                <AccountCard
                  key={index}
                  type="Co-Creator"
                  address={coCreator.address}
                  amount={(Number(coCreator.amount) / 10 ** 9).toFixed(9)}
                  sig={coCreator.sig}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
