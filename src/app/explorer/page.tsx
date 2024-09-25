"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid } from "lucide-react";
import { AppLayoutComponent } from "@/components/app-layout";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { fetchFilm, fetchLabel } from "../../../anchorClient";
import { PublicKey } from "@solana/web3.js";
import { fetchFlyer, Flyer } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Masonry from "react-masonry-css";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useClientPopcorn } from "@/ClientPopcornContext";
import { Clock, Popcorn } from "lucide-react";

const CardComponent = ({
  flyer,
  amount,
  index,
}: {
  flyer: Flyer;
  amount: bigint;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // 256777783 demo bigint
  const beforeAmount = (Number(amount) / 10 ** 9).toFixed(4);
  const afterAmount = (Number(amount - BigInt(256777783)) / 10 ** 9).toFixed(4);

  const getTitleContent = (index: number) => {
    if (index === 0) {
      return (
        <>
          <span className="mr-2">1min | 🍿1POP</span>
        </>
      );
    } else if (index === 1) {
      return (
        <>
          <s className="mr-2">1min | 🍿1POP</s>
          <span>→</span>
          <span>15s | 🍿0.25POP</span>
        </>
      );
    } else {
      return (
        <>
          <span className="mr-2">20min | 🍿20POP</span>
        </>
      );
    }
  };

  const handleEnter = (filmPdaStr: string) => {
    router.push(`/theater/${filmPdaStr}`); // Replace with the actual path you want to navigate to
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          key={flyer.filmPda.toString()}
          className="overflow-hidden shadow-lg mb-4 mx-1 cursor-pointer transition-transform duration-200 hover:scale-105 bg-black text-white"
        >
          <CardHeader className="p-2 bg-gray-900">
            <CardTitle className="text-xs sm:text-sm font-bold flex items-center text-white space-x-2">
              {getTitleContent(index)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <img
              src={flyer.image}
              alt={flyer.name}
              className="w-full h-full object-cover"
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
            <span>0.25 POP</span>
          </div>
          <div className="grid gap-4 p-4 border-2 border-white rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Balance:</span>
              <span className="font-bold text-lg">🍿 {beforeAmount} POP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">After Balance:</span>
              <span className="font-bold text-lg">🍿 {afterAmount} POP</span>
            </div>
          </div>
          {Number(afterAmount) > 0 ? (
            <Button
              className="w-full mt-2 bg-[#14F195] hover:bg-[#0fd584] text-gray-900"
              size="lg"
              onClick={() => handleEnter(flyer.filmPda.toString())}
            >
              Enter
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-red-400 mb-2">Insufficient Pops</p>
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
  );
};

export default function Component() {
  const wallet = useAnchorWallet();
  const mockLabel = new PublicKey(
    "9amqGxneCr5AudKbrw7FSFkUg1s9VUpJMztR6rKVV8mK"
  );
  const [columnCount, setColumnCount] = useState(2);
  const { clientATAInfo } = useClientPopcorn();
  console.log(clientATAInfo?.address);

  const { data: labelData } = useQuery({
    queryKey: ["labelData", wallet, mockLabel],
    queryFn: async () => {
      if (!wallet) throw new Error("Missing wallet");
      return await fetchLabel(wallet, mockLabel);
    },
    enabled: !!wallet,
  });

  const { data: filmDatas } = useQuery({
    queryKey: ["filmDatas", labelData, wallet],
    queryFn: async () => {
      if (!labelData || !wallet) throw new Error("Missing dependencies");
      return await Promise.all(
        labelData.films.map(async (filmPda: PublicKey) => {
          const filmData = await fetchFilm(wallet, filmPda);
          return { ...filmData, filmPda };
        })
      );
    },
    enabled: !!labelData,
  });

  const { data: flyers } = useQuery({
    queryKey: ["flyers", filmDatas],
    queryFn: async () => {
      if (!filmDatas) throw new Error("Missing film data");
      return await Promise.all(
        filmDatas.map((film) => fetchFlyer(film.collectionMint, film.filmPda))
      );
    },
    enabled: !!filmDatas,
  });

  const breakpointColumnsObj = {
    default: columnCount,
    320: columnCount, // Ensure even the smallest screens respect the column count
  };

  if(filmDatas) console.log(filmDatas);

  return (
    wallet && (
      <AppLayoutComponent wallet={wallet}>
        <div className="container mx-auto px-2">
          <div className="flex justify-end my-2 space-x-2">
            <Button
              variant={columnCount === 1 ? "default" : "ghost"}
              size="icon"
              onClick={() => setColumnCount(1)}
              className="text-purple-500"
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">Single column layout</span>
            </Button>
            <Button
              variant={columnCount === 2 ? "default" : "ghost"}
              size="icon"
              onClick={() => setColumnCount(2)}
              className="text-purple-500"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Two column layout</span>
            </Button>
          </div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-1"
            columnClassName="pl-1 bg-clip-padding"
          >
            {flyers?.map((flyer, index) => (
              <CardComponent
                key={index}
                flyer={flyer as Flyer}
                amount={clientATAInfo?.amount || BigInt(0)} // デフォルト値を設定
                index={index}
              />
            ))}
          </Masonry>
        </div>
      </AppLayoutComponent>
    )
  );
}
