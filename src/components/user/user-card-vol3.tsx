"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Avatar from "boring-avatars"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import * as spl from "@solana/spl-token"
import { TokenMetadata } from "@solana/spl-token-metadata"
import { getUserProfile, UserSet } from "../../../anchorClient"

interface UserCardV3Props {
  wallet: AnchorWallet | null
  userPda?: web3.PublicKey
}

const UserCardV3: FC<UserCardV3Props> = ({ wallet, userPda }) => {
  const [userProfile, setUserProfile] = useState<UserSet>()
  const [mintMetaData, setMintMetaData] = useState<TokenMetadata | null>()
  const [clientATA, setClientATA] = useState<spl.Account>()

  const MINT = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!)

  useEffect(() => {
    if (!wallet || !wallet.publicKey) return
    const fetchData = async () => {
      const connection = new web3.Connection(
        "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781",
        "confirmed"
      )
      const mintMetaData = await spl.getTokenMetadata(connection, MINT)
      setMintMetaData(mintMetaData)

      const authority = userProfile?.userAccount.authority
      if (!authority) return
      const clientATA = spl.getAssociatedTokenAddressSync(
        MINT,
        authority,
        undefined,
        spl.TOKEN_2022_PROGRAM_ID
      )
      const clientATAInfo = await spl.getAccount(
        connection,
        clientATA,
        { commitment: "confirmed" } as unknown as web3.Commitment,
        spl.TOKEN_2022_PROGRAM_ID
      )
      setClientATA(clientATAInfo)
    }

    fetchData()
  }, [wallet, userPda, userProfile])

  useEffect(() => {
    async function getUserData() {
      if (!wallet || !userPda) return
      const data = await getUserProfile(wallet, userPda)
      setUserProfile(data)
    }
    getUserData()
  }, [userPda, wallet])

  if (!userProfile) return null

  const tokenAmount = clientATA?.amount
    ? (Number(clientATA.amount) / 10 ** 9).toFixed(3)
    : "..."

  return (
<Card className="w-full max-w-md overflow-hidden bg-black">
      <div className="relative h-48 bg-[#14F195]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <CardContent className="relative -mt-20 flex flex-col items-center p-6">
        <Avatar
          name={userProfile.userAccount.name}
          colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
          variant="pixel"
          size={80}
        />
        <h2 className="mt-4 text-2xl font-bold text-white">{userProfile.userAccount.name}</h2>
        <div className="flex gap-2">
        <p className="text-sm text-gray-200">Labels: {userProfile.userAccount.label.length}</p>
        <p className="text-sm text-gray-200">History: {userProfile.userAccount.history.length}</p>
        </div>

        <div className="mt-4 w-full flex items-center justify-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl" role="img" aria-label="Popcorn">
              🍿
            </span>
            <span className="text-2xl font-bold text-white">{tokenAmount}</span>
          </div>
          <span className="text-sm font-medium text-white">{mintMetaData?.symbol}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCardV3