"use client";

import { AppLayoutComponent } from "@/components/app-layout";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import React, { useEffect, useState } from "react";
import { fetchFilm, Film } from "../../../../../anchorClient";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import PopcornVideo from "@/components/popcorn-video";
import { HistoryNFT } from "@/lib/metaplex";

export default function Page({
  params,
}: {
  params: { filmPda: string; historyNFT: string };
}) {
  const filmPda = new PublicKey(params.filmPda);
  const historyNFT = new PublicKey(params.historyNFT);
  const wallet = useAnchorWallet();

  const [filmData, setFilmData] = useState<Film>();
  const [clientATA, setClientATA] = useState<PublicKey>();
  const [historyOwner, setHistoryOwner] = useState<PublicKey>();

  useEffect(() => {
    async function fetchFilmData() {
      if (!wallet) return;
      const data = await fetchFilm(wallet, filmPda);
      setFilmData(data);
    }
    fetchFilmData();
  }, [filmPda, wallet]);

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

  useEffect(() => {
    const umi = createUmi(
      "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781"
    ).use(dasApi());

    const fetchAsset = async () => {
      if (!historyNFT) return;
      const result: HistoryNFT = await (umi.rpc as unknown as { getAsset: (id: string) => Promise<HistoryNFT> }).getAsset(historyNFT.toString());
      const owner = result.ownership.owner;
      setHistoryOwner(new PublicKey(owner));
    };
    fetchAsset();
  }, [wallet, historyNFT]);

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
                transferType="History"
                historyOwner={historyOwner}
              />
            )}
          </div>
        </AppLayoutComponent>
      )}
    </>
  );
}
