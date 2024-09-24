"use client";

import { useEffect, useRef, useState } from "react";
import ProfileForm from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import VerticalUserCard from "@/components/user/vertical-user-card";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchUser, UserSet } from "../../anchorClient";

export default function EnterCard({ wallet }: { wallet: AnchorWallet | null }) {
  const [userProfile, setUserProfile] = useState<UserSet>();

  useEffect(() => {
    async function getUser() {
      if (wallet && wallet.publicKey) {
        const data = await fetchUser(wallet, wallet.publicKey);
        setUserProfile(data);
      }
    }
    getUser();
  }, [wallet]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<
    typeof window.VANTA.FOG
  > | null>(null);

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
          blurFactor: 0.9,
          speed: 1.1,
          zoom: 0.5,
        });
        setVantaEffect(effect);
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect && cardRef.current) {
        (vantaEffect as unknown as { resize: () => void }).resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [vantaEffect]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="flex-grow relative overflow-hidden rounded-lg min-h-[300px]"
        ref={cardRef}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {wallet ? (
            <div className="w-full h-full flex items-center justify-center">
              {userProfile?.userAccount ? (
                <VerticalUserCard userAccount={userProfile}  />
              ) : (
                <ProfileForm />
              )}
            </div>
          ) : (
            <div className="text-center">
              {/* <p className="text-lg mb-4">ウォレットを接続してください</p> */}
              <WalletMultiButton />
            </div>
          )}
        </div>
      </div>
      {wallet && userProfile ? (
        <Link href="/profile" className="block mt-4">
          <Button className="w-full text-lg py-4 bg-gradient-to-r from-gray-100 to-white text-black border border-gray-200 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:from-white hover:to-gray-100">
          Enter🍿
          </Button>
        </Link>
      ) : (
        <Button
          className="w-full text-lg py-4 bg-gradient-to-r from-gray-200 to-gray-100 text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed mt-4 shadow-sm"
          disabled
        >
          Enter🍿
        </Button>
      )}
    </div>
  );
}
