"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Avatar from "boring-avatars";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useUserAccount } from "@/hooks/useUserAccount";
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { useEffect, useState } from "react";
import { TokenMetadata } from "@solana/spl-token-metadata";

const UserCardV3: FC<{ wallet: AnchorWallet | null }> = ({ wallet }) => {
  const { userAccount, isLoading } = useUserAccount(wallet);
  const MINT = new web3.PublicKey(
    "H61GtPmCHYADu52F2rK6LL5oZGKuTJpxjYmdAtf53PLC"
  );
  const [mintMetaData, setMintMetaData] = useState<TokenMetadata | null>();
  const [clientATA, setClientATA] = useState<spl.Account>();

  useEffect(() => {
    if (!wallet || !wallet.publicKey) return;
    const fetchData = async () => {
      const connection = new web3.Connection(
        "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781",
        "confirmed"
      );
      const mintMetaData = await spl.getTokenMetadata(connection, MINT);
      const clientATA = spl.getAssociatedTokenAddressSync(
        MINT,
        wallet?.publicKey,
        undefined,
        spl.TOKEN_2022_PROGRAM_ID
      );
      const clientATAInfo = await spl.getAccount(
        connection,
        clientATA,
        { commitment: "confirmed" } as unknown as web3.Commitment,
        spl.TOKEN_2022_PROGRAM_ID
      );

      setMintMetaData(mintMetaData);
      setClientATA(clientATAInfo);
    };

    fetchData();
  }, [wallet]);

  return (
    <>
      {isLoading ? (
        <>loading</>
      ) : (
        userAccount && (
          <Card className="w-full bg-transparent shadow-none">
            <CardHeader className="flex flex-col items-center space-y-4 pb-2">
              <Avatar
                name="Helen Keller"
                colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
                variant="marble"
                size={80}
              />
              <div className="text-center text-white">
                <h2 className="text-xl font-bold">
                  {userAccount.userAccount.name}
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center space-x-2 my-4">
                <span className="text-4xl">🍿</span>

                <span className="text-5xl font-extrabold text-white">
                  {(clientATA?.amount
                    ? clientATA?.amount / BigInt(10 ** 9)
                    : 0
                  ).toString()}
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white">
                    {mintMetaData?.symbol}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-6 text-white">
                <div className="text-center">
                  <p className="text-3xl font-bold">1</p>
                  <p className="text-sm mt-1">Label</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">10</p>
                  <p className="text-sm mt-1">History</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </>
  );
};

export default UserCardV3;
