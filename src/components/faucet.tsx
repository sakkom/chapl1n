"use client";
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { useEffect, useState } from "react";
import { TokenMetadata } from "@solana/spl-token-metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PopcornFaucet } from "@/components/popcorn-faucet";
import { postAirdrop } from "@/lib/api";

export default function Faucet({
  publicKey,
}: {
  publicKey: web3.PublicKey | null;
}) {
  const [mintMetaData, setMintMetaData] = useState<TokenMetadata | null>();
  const [mintInfo, setMintInfo] = useState<spl.Mint>();
  const [tokenAccountInfo, setTokenAccountInfo] = useState<spl.Account>();

  useEffect(() => {
    const fetchData = async () => {
      const mint = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!);
      const tokenAccount = new web3.PublicKey(
        process.env.NEXT_PUBLIC_TOKEN_ACCOUNT!
      );
      const connection = new web3.Connection(
        "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781",
        "confirmed"
      );
      const mintMetaData = await spl.getTokenMetadata(connection, mint);
      const mintInfo = await spl.getMint(
        connection,
        mint,
        { commitment: "confirmed" } as unknown as web3.Commitment,
        spl.TOKEN_2022_PROGRAM_ID
      );
      const tokenAccountInfo = await spl.getAccount(
        connection,
        tokenAccount,
        { commitment: "confirmed" } as unknown as web3.Commitment,
        spl.TOKEN_2022_PROGRAM_ID
      );
      // console.log("ミントメタデータ:", mintMetaData);
      // console.log("ミント情報:", mintInfo);
      console.log("トークンアカウント情報:", tokenAccountInfo);

      setMintMetaData(mintMetaData); // mintMetaDataを設定
      setMintInfo(mintInfo); // mintInfoを設定
      setTokenAccountInfo(tokenAccountInfo); // tokenAccountInfoを設定
    };

    fetchData();
  }, []);

  const handleAirdrop = async () => {
    try {
      if (!publicKey) return;
      //CHECK:: amountの同期をする!
      await postAirdrop(publicKey?.toString());
    } catch (e) {}
  };

  return (
    <div>
      <Card className="w-full max-w-lg overflow-hidden bg-gray-900 shadow-lg rounded-2xl border-gray-800">
        <div className="relative p-6 bg-gradient-to-r from-gray-900 to-black">
          <div
            className="absolute inset-0 bg-opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #2a2a2a, #2a2a2a 1px, transparent 1px, transparent 20px)",
              backgroundSize: "20px 100%",
            }}
          ></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-white mb-1">
                Popcorn Faucet
              </h2>
              <div className="text-sm text-gray-400 space-x-4">
                <span>
                  Supply:{" "}
                  <span className="font-medium text-[#14F195]">
                    {(mintInfo?.supply
                      ? mintInfo.supply / BigInt(10 ** 9)
                      : 0
                    ).toString()}{" "}
                  </span>
                  <span>{mintMetaData?.symbol}</span>
                </span>
                <span>
                  Available:{" "}
                  <span className="font-medium text-[#14F195]">
                    {(tokenAccountInfo?.amount
                      ? tokenAccountInfo.amount / BigInt(10 ** 9)
                      : 0
                    ).toString()}{" "}
                  </span>
                  <span>{mintMetaData?.symbol}</span>
                </span>
              </div>
            </div>
            <Button
              onClick={handleAirdrop}
              disabled={tokenAccountInfo?.amount === BigInt(0)}
              className="bg-[#14F195] hover:bg-[#14F195]/80 text-black transition-colors duration-200 text-sm py-2 px-4 rounded-full font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🍿 Airdrop
            </Button>
          </div>
        </div>
        <CardContent className="p-0 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 border-t border-gray-700">
          <PopcornFaucet />
        </CardContent>
      </Card>
    </div>
  );
}
