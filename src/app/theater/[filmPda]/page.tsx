"use client";

import { AppLayoutComponent } from "@/components/app-layout";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { fetchFilm, Film } from "../../../../anchorClient";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import PopcornVideo from "@/components/popcorn-video";

export default function Page({ params }: { params: { filmPda: string } }) {
  const filmPda = new PublicKey(params.filmPda);
  const wallet = useAnchorWallet();

  const [filmData, setFilmData] = useState<Film>();
  const [clientATA, setClientATA] = useState<PublicKey>();

  useEffect(() => {
    async function fetchFilmData() {
      if (!wallet) return;
      const data = await fetchFilm(wallet, filmPda);
      setFilmData(data);
    }
    fetchFilmData();
  }, [filmPda]);

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
