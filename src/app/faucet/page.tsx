"use client"
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { useEffect, useState } from "react";
import {
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PopcornFaucet } from "@/components/popcorn-faucet";
import { postAirdrop } from "@/lib/api";
import { useWallet } from "@solana/wallet-adapter-react";


export default function Page() {
  const { publicKey } = useWallet();
  const mint = new web3.PublicKey("H61GtPmCHYADu52F2rK6LL5oZGKuTJpxjYmdAtf53PLC");
  const tokenAccount = new web3.PublicKey("54hkFbtFb2c7Yu7a3YBqsQPwkePbnwt7zxkgC2PEjG5G");
  const [mintMetaData, setMintMetaData] = useState<TokenMetadata | null>();
  const [mintInfo, setMintInfo] = useState<spl.Mint>();
  const [tokenAccountInfo, setTokenAccountInfo] = useState<spl.Account>();

  useEffect(() => {
    const fetchData = async () => {
      const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781", 'confirmed');
      const mintMetaData = await spl.getTokenMetadata(connection, mint);
      const mintInfo = await spl.getMint(connection, mint, { commitment: "confirmed" } as unknown as web3.Commitment, spl.TOKEN_2022_PROGRAM_ID);
      const tokenAccountInfo = await spl.getAccount(connection, tokenAccount, { commitment: "confirmed" } as unknown as web3.Commitment, spl.TOKEN_2022_PROGRAM_ID);
      // console.log("ミントメタデータ:", mintMetaData);
      // console.log("ミント情報:", mintInfo);
      // console.log("トークンアカウント情報:", tokenAccountInfo);
      
      setMintMetaData(mintMetaData); // mintMetaDataを設定
      setMintInfo(mintInfo); // mintInfoを設定
      setTokenAccountInfo(tokenAccountInfo); // tokenAccountInfoを設定
    };

    fetchData();
  }, []);

  const handleAirdrop = async() => {
    try {
      if(!publicKey) return;
      //CHECK:: amountの同期をする!
     await postAirdrop(publicKey?.toString());
    } catch(e) {
    }
  };

  return (
    <div>
      <Card className="w-full max-w-lg overflow-hidden bg-white shadow-lg rounded-2xl">
        <div className="relative p-6 bg-gradient-to-r from-gray-50 to-white">
          <div className="absolute inset-0 bg-opacity-50" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #f0f0f0, #f0f0f0 1px, transparent 1px, transparent 20px)',
            backgroundSize: '20px 100%'
          }}></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Popcorn Faucet</h2>
              <div className="text-sm text-gray-500 space-x-4">
                <span>Supply: <span className="font-medium text-gray-900">{(mintInfo?.supply ? mintInfo.supply / BigInt(10**9) : 0).toString()} </span><span>{mintMetaData?.symbol}</span></span>
                <span>Available: <span className="font-medium text-gray-900">{(tokenAccountInfo?.amount ? tokenAccountInfo.amount / BigInt(10**9) : 0).toString()} </span><span>{mintMetaData?.symbol}</span></span>
              </div>
            </div>
            <Button 
              onClick={handleAirdrop} 
              disabled={tokenAccountInfo?.amount === BigInt(0)} // 修正: BigIntリテラルを使用せずに比較
              className="bg-black hover:bg-gray-800 text-white transition-colors duration-200 text-sm py-2 px-4 rounded-full font-medium shadow-sm"
            >
              🍿 Airdrop
            </Button>
          </div>
        </div>
        <CardContent className="p-0 bg-gradient-to-b from-white to-gray-50">
          <PopcornFaucet />
        </CardContent>
      </Card>
    </div>
  );
}