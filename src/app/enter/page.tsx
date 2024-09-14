'use client'

import { useEffect, useRef, useState } from "react"
import ProfileForm from "@/components/profile-form"
import { Button } from "@/components/ui/button"
import VerticalUserCard from "@/components/user/vertical-user-card"
import { useUserAccount } from "@/hooks/useUserAccount"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Link from "next/link"

export default function EnterPage() {
  const wallet = useAnchorWallet()
  const { userAccount, isLoading } = useUserAccount(wallet ?? null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof window.VANTA.FOG> | null>(null)

  useEffect(() => {
    const loadVanta = async () => {
      if (!vantaEffect && cardRef.current && window.VANTA) {
        const effect = window.VANTA.FOG({
          el: cardRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x14f195,
          midtoneColor: 0xffffff,
          lowlightColor: 0x9945ff,
          baseColor: 0x000000,
          blurFactor: 0.90,
          speed: 1.10,
          zoom: 0.50
        })
        setVantaEffect(effect)
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect && cardRef.current) {
        (vantaEffect as unknown as { resize: () => void }).resize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [vantaEffect])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 w-screen bg-black">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left side: App introduction */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Welcome to Our dApp
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Experience the power of decentralized applications. Our dApp
              offers secure, transparent, and efficient blockchain-based
              solutions for your needs.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Decentralized and secure</li>
              <li>Transparent transactions</li>
              <li>Community-driven development</li>
              <li>Innovative blockchain technology</li>
            </ul>
          </div>
        </div>

        {/* Right side: User interaction area */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="h-[400px] relative overflow-hidden rounded-lg" ref={cardRef}>
            <div className="relative z-10 h-full flex flex-col justify-center p-6">
              {wallet ? (
                <>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-lg">処理中...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userAccount ? (
                        <VerticalUserCard userAccount={userAccount} />
                      ) : (
                        <ProfileForm />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 flex flex-col items-center">
                  <p className="text-lg text-center">
                    ウォレットを接続してください
                  </p>
                  <WalletMultiButton />
                </div>
              )}
            </div>
          </div>
          {wallet && userAccount && (
            <div>
            <Link href={`/`} className="">
              <Button className="w-full text-lg py-6 bg-[#14F195] hover:bg-[#0fd180] text-black">🍿🍿🍿 Enter 🍿🍿🍿</Button>
            </Link>
            </div>
          )}
          {wallet && !userAccount && (
            <Button className="w-full text-lg py-6 bg-[#14F195] hover:bg-[#0fd180] text-black opacity-50 cursor-not-allowed" disabled>
              Enter 🍿
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}