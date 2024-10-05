"use client";

import { useState, useEffect } from "react";
import { executeTxNode, getCredit } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {  Check, X, Play } from "lucide-react";
import { approveTxUser, fetchFlyer, Flyer, rejectTxUser } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import { TransactionAccount } from "@sqds/sdk";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WideUser } from "./user/wide-user";
import Link from "next/link";
import { Separator } from "./ui/separator";

enum TxStatus {
  Active = "active",
  ExecuteReady = "executeReady",
  Executed = "executed",
}

interface MsTransactionsProps {
  msPda: string;
  wallet: AnchorWallet | undefined;
  member: string[];
  labelPda: string;
  threshold: number | undefined;
}

interface DecodedData {
  actor?: {
    creator: string[];
    coCreator: string[];
  };
  collectionMint?: string;
  label: string;
  filmPda?: string;
}

interface MsFilm {
  txState: TransactionAccount & { status: { [key in TxStatus]: boolean } };
  decodedDatas: {
    decodedData: DecodedData[];
    txPda: string;
  };
  flyer: Flyer;
}

function ActionButtons({
  status,
  onApprove,
  onReject,
  onExecute,
}: {
  status: TxStatus;
  onApprove: () => void;
  onReject: () => void;
  onExecute: () => void;
}) {
  switch (status) {
    case TxStatus.Active:
      return (
        <div className="flex flex-col space-y-2">
          <Button
            onClick={onApprove}
            variant="outline"
            size="sm"
            className="bg-[#14F195] text-black hover:bg-transparent hover:text-[#14F195] hover:border-[#14F195] transition-colors"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            size="sm"
            className="bg-[#F11470] text-white hover:bg-transparent hover:text-[#F11470] hover:border-[#F11470] transition-colors"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      );
    case TxStatus.ExecuteReady:
      return (
        <Button
          onClick={onExecute}
          variant="outline"
          size="sm"
          className="bg-[#14F195] text-black hover:bg-transparent hover:text-[#14F195] hover:border-[#14F195] transition-colors w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          Execute
        </Button>
      );
    case TxStatus.Executed:
      return <Badge variant="secondary">Published</Badge>;
    default:
      return null;
  }
}

function TransactionModal({
  msFilm,
  wallet,
  threshold,
  member,
  onApprove,
  onReject,
  onExecute,
}: {
  msFilm: MsFilm;
  wallet: AnchorWallet;
  threshold: number | undefined;
  member: string[];
  onApprove: () => void;
  onReject: () => void;
  onExecute: () => void;
}) {
  const status = Object.entries(msFilm.txState.status).find(
    ([value]) => value
  )?.[0] as TxStatus;

  return (
    <DialogContent className="sm:max-w-[425px] bg-black text-white">
      <DialogHeader className="space-y-4">
        <div className="flex justify-between items-center ">
          <Badge
            variant={
              status === TxStatus.Active
                ? "secondary"
                : status === TxStatus.ExecuteReady
                ? "secondary"
                : "secondary"
            }
            className="text-xs px-2 py-1"
          >
            {status === TxStatus.Active
              ? "Active"
              : status === TxStatus.ExecuteReady
              ? "Ready"
              : "Executed"}
          </Badge>
        </div>
        <div className="flex justify-between text-sm gap-2">
          <Card className="flex-1 border-[1px] border-white">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-[#14F195]">
                {msFilm.txState.approved.length}
              </div>
              <CardFooter className="p-1 text-xs text-gray-400 flex justify-center items-center">
                Approved
              </CardFooter>
            </CardContent>
          </Card>
          <Card className="flex-1 border-[1px] border-white">
            <CardContent className="p-3 text-center ">
              <div className="text-2xl font-bold text-[#F11470]">
                {msFilm.txState.rejected.length}
              </div>
              <CardFooter className="p-1 text-xs text-gray-400 flex justify-center items-center">
                Rejected
              </CardFooter>
            </CardContent>
          </Card>
          <Card className="flex-1 border-[1px] border-white">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {threshold} / 1
              </div>
              <CardFooter className="p-1 text-xs text-gray-400 flex justify-center items-center">
                Threshold
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      </DialogHeader>
      <Separator className="mt-3" />
      <div className="space-y-6">
        {msFilm.decodedDatas.decodedData &&
        msFilm.decodedDatas.decodedData.length > 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardTitle className="text-white text-center font-medium p-4 ">
              Credit Form
            </CardTitle>
            <CardContent className="p-4 space-y-4">
              {msFilm.decodedDatas.decodedData[0].actor && (
                <div>
                  <div>
                    <h3 className="text-xs font-medium text-white mb-2">
                      Creators
                    </h3>
                    {msFilm.decodedDatas.decodedData[0].actor.creator.map(
                      (creator, idx) => (
                        <WideUser
                          key={`creator-${idx}`}
                          authority={new PublicKey(creator)}
                          wallet={wallet}
                        />
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-white mb-2">
                      Co-Creators
                    </h3>
                    {msFilm.decodedDatas.decodedData[0].actor.coCreator.map(
                      (coCreator, idx) => (
                        <WideUser
                          key={`coCreator-${idx}`}
                          authority={new PublicKey(coCreator)}
                          wallet={wallet}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No decoded data available
          </p>
        )}


        {member.includes(wallet.publicKey.toString()) && (
          <ActionButtons
            status={status}
            onApprove={onApprove}
            onReject={onReject}
            onExecute={onExecute}
          />
        )}
      </div>
    </DialogContent>
  );
}
export default function MsTransactions({
  msPda,
  wallet,
  member,
  labelPda,
  threshold,
}: MsTransactionsProps) {
  // const [msFilms, setMsFilms] = useState<MsFilm[]>([])
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [published, setPublished] = useState<MsFilm[]>([]);
  const [unPublished, setUnPublished] = useState<MsFilm[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getCredit(msPda);
      const msFilms = result.createFilmTxs; // 一時的に保存

      const updatedFilms = await Promise.all(
        msFilms.map(async (film: MsFilm) => {
          let collectionMint;
          let filmPda;

          // decodedData配列をループしてcollectionMintとfilmPdaを探す
          for (const data of film.decodedDatas.decodedData) {
            if (data.collectionMint) {
              collectionMint = data.collectionMint;
            }
            if (data.filmPda) {
              filmPda = data.filmPda;
            }
          }

          console.log("Collection Mint:", collectionMint);
          console.log("Film PDA:", filmPda);

          if (collectionMint && filmPda) {
            try {
              const flyer = await fetchFlyer(
                new PublicKey(collectionMint),
                new PublicKey(filmPda)
              );
              console.log("Fetched Flyer:", flyer);
              return { ...film, flyer: flyer as Flyer }; // Flyer型にキャスト
            } catch (error) {
              console.error("Error fetching flyer:", error);
            }
          }
          return film; // collectionMintまたはfilmPdaがundefinedの場合はそのまま返す
        })
      );
      // console.log("flyer", updatedFilms);

      const published = updatedFilms.filter(
        (film) => film.txState.status.executed
      );
      const unPublished = updatedFilms.filter(
        (film) => !film.txState.status.executed
      );

      setPublished(published);
      setUnPublished(unPublished);
    }

    fetchData();
  }, [msPda]);

  const updateTxState = (txPda: string, newTxState: TransactionAccount) => {
    setUnPublished((prevFilms) =>
      prevFilms.map((film) =>
        film.decodedDatas.txPda === txPda
          ? { ...film, txState: newTxState as MsFilm["txState"] }
          : film
      )
    );
  };

  const handleApprove = async (txPda: string) => {
    console.log("Approved:", txPda);
    if (!wallet) return;
    const newTxState = (await approveTxUser(
      wallet,
      new PublicKey(txPda)
    )) as TransactionAccount;
    updateTxState(txPda, newTxState);
  };

  const handleReject = async (txPda: string) => {
    console.log("Rejected:", txPda);
    if (!wallet) return;
    const newTxState = (await rejectTxUser(
      wallet,
      new PublicKey(txPda)
    )) as TransactionAccount;
    updateTxState(txPda, newTxState);
  };

  const handleExecute = async (txPda: string) => {
    console.log("Executed:", txPda);
    const data = await executeTxNode(txPda);
    const newTxState = data.txState as TransactionAccount;
    updateTxState(txPda, newTxState);
  };

  return (
    <div>
      {wallet && (
        <Tabs defaultValue="inner1" className="w-full mt-4">
          <TabsList className="w-full flex justify-center bg-transparent">
            <TabsTrigger
              value="inner1"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="inner2"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              UnPublished
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inner1" className="mt-4">
            {published.length > 0 && (
              <div className="space-y-4">
                {published.map((msFilm, index) => (
                  <div className="" key={index}>
                    {msFilm.flyer && (
                      <img
                        src={msFilm.flyer.image}
                        alt={msFilm.flyer.name}
                        className=" object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inner2" className="mt-4">
            <div>
              {member.includes(wallet.publicKey.toString()) && (
                <div>
                  <Link href={`/label/new-film/${labelPda}`}>
                    <Button>+ new video work</Button>
                  </Link>
                </div>
              )}
            </div>
            {unPublished.length > 0 && (
              <div className="space-y-4">
                {unPublished.map((msFilm, index) => {
                  const status = Object.entries(msFilm.txState.status).find(
                    ([value]) => value
                  )?.[0] as TxStatus;
                  return (
                    <Card
                      key={index}
                      className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="">
                          <Dialog
                            open={openModalIndex === index}
                            onOpenChange={(isOpen) =>
                              setOpenModalIndex(isOpen ? index : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <div className="flex flex-col">
                                <Badge
                                  variant={
                                    status === TxStatus.Active
                                      ? "default"
                                      : status === TxStatus.ExecuteReady
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="h-6"
                                >
                                  {status === TxStatus.Active
                                    ? "Active"
                                    : status === TxStatus.ExecuteReady
                                    ? "Ready"
                                    : "Executed"}
                                </Badge>
                                {msFilm.flyer && (
                                  <img
                                    src={msFilm.flyer.image}
                                    alt={msFilm.flyer.name}
                                    className=" object-cover"
                                  />
                                )}
                              </div>
                            </DialogTrigger>
                            <TransactionModal
                              msFilm={msFilm}
                              wallet={wallet}
                              threshold={threshold}
                              member={member}
                              onApprove={() =>
                                handleApprove(msFilm.decodedDatas.txPda)
                              }
                              onReject={() =>
                                handleReject(msFilm.decodedDatas.txPda)
                              }
                              onExecute={() =>
                                handleExecute(msFilm.decodedDatas.txPda)
                              }
                            />
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
