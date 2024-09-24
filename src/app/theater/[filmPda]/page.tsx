"use client";

import { AppLayoutComponent } from "@/components/app-layout";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { fetchFilm } from "../../../../anchorClient";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import PopcornVideo from "@/components/popcorn-video";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params }: { params: { filmPda: string } }) {
  const filmPda = new PublicKey(params.filmPda);
  const wallet = useAnchorWallet();

  // const [filmData, setFilmData] = useState<Film>();
  const [clientATA, setClientATA] = useState<PublicKey>();

  const { data: filmData } = useQuery({
    queryKey: ["filmData", wallet, filmPda],
    queryFn: async () => {
      if (!wallet) throw new Error("Wallet is not connected");
      return await fetchFilm(wallet, filmPda);
    },
    enabled: !!wallet,
  });

  useEffect(() => {
    const getCientATA = () => {
      if (!wallet) return;
      const mintKey = process.env.NEXT_PUBLIC_MINT;
      if (!mintKey) {
        throw new Error("NEXT_PUBLIC_MINT is not defined");
      }
      const MINT = new PublicKey(mintKey);
      const clientATA = getAssociatedTokenAddressSync(
        MINT,
        wallet?.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      setClientATA(clientATA);
    };
    getCientATA();
  }, [wallet]);

  return (
    <>
      {wallet && (
        <AppLayoutComponent wallet={wallet}>
          <div className="aspect-video mb-4">
            {filmData && clientATA && wallet && (
              <PopcornVideo
                videoUri="/Radar.MOV"
                filmData={filmData}
                clientATA={clientATA}
                wallet={wallet}
                transferType="Normal"
              />
            )}
          </div>
        </AppLayoutComponent>
      )}
    </>
  );
}
