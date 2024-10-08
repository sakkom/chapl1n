"use client";

import React, { useEffect, useState } from "react";
import { Globe, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchUser, UserSet } from "../../anchorClient";
import { useClientPopcorn } from "@/ClientPopcornContext";
import Avatar from "boring-avatars";

export function AppLayoutComponent({
  children,
  wallet,
}: {
  children: React.ReactNode;
  wallet: AnchorWallet;
}) {
  const [user, setUser] = useState<UserSet>();
  const { clientATAInfo } = useClientPopcorn();

  useEffect(() => {
    async function getPda() {
      if (!wallet) return;
      const data = await fetchUser(wallet, wallet.publicKey);
      setUser(data);
    }
    getPda();
  }, [wallet]);

  const formattedAmount = clientATAInfo
    ? (Number(clientATAInfo.amount) / 10 ** 9).toFixed(3)
    : "0.000";

  return (
    <div className="flex justify-center min-h-screen ">
      <div className="w-full max-w-3xl lg:w-3/5 relative bg-white bg-opacity-15 shadow-md">
        {/* Top Bar */}
        <header className="fixed top-0 z-50 w-full max-w-3xl lg:w-3/5 bg-black bg-opacity-15 border-b border-gray-700">
          <div className="px-4 h-14 flex justify-between items-center">
            <Link href="/top" className="text-base font-bold text-white">
              Crews
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar
                  name="Helen Keller"
                  colors={[
                    "#3fbbb7",
                    "#9945ff",
                    "#14f195",
                    "#5997cd",
                    "#7179e0",
                  ]}
                  variant="pixel"
                  size={25}
                />
                <span className="text-sm font-medium text-white">
                  {user?.userAccount?.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span role="img" aria-label="popcorn" className="text-lg">
                  🍿
                </span>
                <span className="text-sm font-medium text-white">
                  {formattedAmount}
                </span>
              </div>
              <WalletMultiButton />
            </div>
          </div>
        </header>
        {/* Content Area */}
        <main className="flex-grow mt-14 mb-14 px-0 sm:px-0 xs:px-0 overflow-auto min-h-screen text-white">
          {children}
        </main>

        {/* Bottom Bar */}
        <footer className="fixed bottom-0 z-50 bg-black bg-opacity-15 border-t border-gray-700 w-full max-w-3xl lg:w-3/5">
          <div className="px-4 h-14 flex justify-around items-center">
            <Link href="/explorer" passHref>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1"
              >
                <Globe className="h-5 w-5 text-white" />
                <span className="text-xs text-white">Explorer</span>
              </Button>
            </Link>
            <Link href={`/profile/${user?.userPda?.toString()}`} passHref>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1"
              >
                <UserCircle className="h-5 w-5 text-white" />
                <span className="text-xs text-white">Profile</span>
              </Button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
