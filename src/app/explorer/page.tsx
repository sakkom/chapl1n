"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid } from "lucide-react";
import { AppLayoutComponent } from "@/components/app-layout";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { fetchFilm, fetchLabel } from "../../../anchorClient";
import { PublicKey } from "@solana/web3.js";
import { fetchFlyer, Flyer } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Masonry from "react-masonry-css";
import { useClientPopcorn } from "@/ClientPopcornContext";
import { MockCard } from "@/components/mock-card";


export default function Page() {
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
              <MockCard
                key={index}
                flyer={flyer as Flyer}
                amount={Number(clientATAInfo?.amount) || Number(0)} // デフォルト値を設定
                index={index}
              />
            ))}
          </Masonry>
        </div>
      </AppLayoutComponent>
    )
  );
}
