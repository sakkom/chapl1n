'use client'

import { useState, useEffect } from "react"
import { executeTxNode, getCredit } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { ChevronRight, Check, X, Play } from "lucide-react"
import { approveTxUser, rejectTxUser } from "@/lib/utils"
import { PublicKey } from "@solana/web3.js"
import { TransactionAccount } from "@sqds/sdk"
import { AnchorWallet } from "@solana/wallet-adapter-react"

enum TxStatus {
  Active = 'active',
  ExecuteReady = 'executeReady',
  Executed = 'executed',
}

interface MsTransactionsProps {
  msPda: string
  wallet: AnchorWallet | undefined
}

interface DecodedData {
  actor?: {
    creator: string[]
    coCreator: string[]
  }
  collectionMint?: string
  label: string
  filmPda?: string
}

interface MsFilm {
  txState: TransactionAccount & { status: { [key in TxStatus]: boolean } }
  decodedDatas: {
    decodedData: DecodedData[]
    txPda: string
  }
}

function ActionButtons({
  status,
  onApprove,
  onReject,
  onExecute,
}: {
  status: TxStatus
  onApprove: () => void
  onReject: () => void
  onExecute: () => void
}) {
  switch (status) {
    case TxStatus.Active:
      return (
        <div className="flex space-x-2">
          <Button
            onClick={onApprove}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-100"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-100"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      )
    case TxStatus.ExecuteReady:
      return (
        <Button
          onClick={onExecute}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-100"
        >
          <Play className="mr-2 h-4 w-4" />
          Execute
        </Button>
      )
    case TxStatus.Executed:
      return <Badge variant="secondary">Published</Badge>
    default:
      return null
  }
}

function TransactionModal({ msFilm, onApprove, onReject, onExecute }: { msFilm: MsFilm; onApprove: () => void; onReject: () => void; onExecute: () => void }) {
  const status = Object.entries(msFilm.txState.status).find(([value]) => value)?.[0] as TxStatus

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Transaction Details
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Transaction PDA:</p>
        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
          {msFilm.decodedDatas.txPda}
        </p>
      </div>
      <ScrollArea className="h-[400px] w-full mt-4">
        {msFilm.decodedDatas.decodedData &&
        msFilm.decodedDatas.decodedData.length > 0 ? (
          msFilm.decodedDatas.decodedData.map(
            (item: DecodedData, index: number) => (
              <Card key={index} className="mb-4 border-gray-200">
                <CardContent className="p-4">
                  {item.collectionMint && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Collection Mint:</p>
                      <p className="text-sm font-mono">{item.collectionMint}</p>
                    </div>
                  )}
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Label:</p>
                    <p className="text-sm">{item.label}</p>
                  </div>
                  {item.actor && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Actor:</p>
                      <p className="text-sm">
                        Creator: {item.actor.creator.join(", ")}
                      </p>
                      <p className="text-sm">
                        Co-Creator: {item.actor.coCreator.join(", ")}
                      </p>
                    </div>
                  )}
                  {item.filmPda && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Film PDA:</p>
                      <p className="text-sm font-mono">{item.filmPda}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          )
        ) : (
          <p className="text-center text-gray-500">No decoded data available</p>
        )}
      </ScrollArea>
      <CardFooter className="flex justify-end pt-4">
        <ActionButtons
          status={status}
          onApprove={onApprove}
          onReject={onReject}
          onExecute={onExecute}
        />
      </CardFooter>
    </DialogContent>
  )
}

export default function MsTransactions({ msPda, wallet }: MsTransactionsProps) {
  const [msFilms, setMsFilms] = useState<MsFilm[]>([])

  useEffect(() => {
    async function getIxStates() {
      const result = await getCredit(msPda)
      console.log(result)
      setMsFilms(result.createFilmTxs)
    }

    getIxStates()
  }, [msPda])

  const updateTxState = (txPda: string, newTxState: TransactionAccount) => {
    setMsFilms((prevFilms) =>
      prevFilms.map((film) =>
        film.decodedDatas.txPda === txPda ? { ...film, txState: newTxState as MsFilm['txState'] } : film
      )
    )
  }

  const handleApprove = async (txPda: string) => {
    console.log("Approved:", txPda)
    if (!wallet) return;
    const newTxState = await approveTxUser(wallet, new PublicKey(txPda)) as TransactionAccount
    updateTxState(txPda, newTxState)
  }

  const handleReject = async (txPda: string) => {
    console.log("Rejected:", txPda)
    if (!wallet) return;
    const newTxState = await rejectTxUser(wallet, new PublicKey(txPda)) as TransactionAccount
    updateTxState(txPda, newTxState)
  }

  const handleExecute = async (txPda: string) => {
    console.log("Executed:", txPda)
    const data= await executeTxNode(txPda);
    const newTxState = data.txState as TransactionAccount;
    updateTxState(txPda, newTxState)
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Credit Contra</CardTitle>
      </CardHeader>
      <CardContent>
        {msFilms.length > 0 ? (
          <div className="space-y-4">
            {msFilms.map((msFilm, index) => {
              const status = Object.entries(msFilm.txState.status).find(([value]) => value)?.[0] as TxStatus
              return (
                <Card
                  key={index}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <CardContent className="p-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-0 h-auto hover:bg-transparent"
                        >
                          <div className="flex items-center space-x-4">
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
                            <span className="text-sm font-medium">
                              txPda: {msFilm.decodedDatas.txPda.slice(0, 20)}...
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Button>
                      </DialogTrigger>
                      <TransactionModal 
                        msFilm={msFilm} 
                        onApprove={() => handleApprove(msFilm.decodedDatas.txPda)}
                        onReject={() => handleReject(msFilm.decodedDatas.txPda)}
                        onExecute={() => handleExecute(msFilm.decodedDatas.txPda)}
                      />
                    </Dialog>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p className="mt-1">
                          Approved: {msFilm.txState.approved.length} | Rejected:{" "}
                          {msFilm.txState.rejected.length}
                        </p>
                      </div>
                      <ActionButtons
                        status={status}
                        onApprove={() => handleApprove(msFilm.decodedDatas.txPda)}
                        onReject={() => handleReject(msFilm.decodedDatas.txPda)}
                        onExecute={() => handleExecute(msFilm.decodedDatas.txPda)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No transactions available
          </p>
        )}
      </CardContent>
    </Card>
  )
}