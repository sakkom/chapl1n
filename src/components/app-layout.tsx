"use client";

import React, { useEffect, useState } from "react";
import { Globe, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { fetchUser } from "../../anchorClient";

export function AppLayoutComponent({
  children,
  wallet,
}: {
  children: React.ReactNode;
  wallet: AnchorWallet,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [userPda, setUserPda] = useState<PublicKey>();

  useEffect(() => {
    async function getPda() {
      if(!wallet) return;
      const data = await fetchUser(wallet, wallet.publicKey);
      setUserPda(data.userPda);
    }
    getPda();
  }, [wallet]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="flex flex-col h-screen min-h-screen mx-auto bg-background"
      style={{ width: "500px" }}
    >
      {/* Top Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ height: "80px" }}
      >
        <div
          className="bg-background border-b"
          style={{ width: "500px", height: "80px" }}
        >
          <div
            className="container mx-auto px-4 py-2 flex justify-between items-center"
            style={{ height: "100%" }}
          >
            <div className="flex items-center">
              <button
                className="text-lg font-bold hover:text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="content-area"
              >
                chapl1n 🍿
              </button>
              <Link href={`/profile/${userPda?.toString()}`} passHref>
                <Button variant="ghost" size="lg" className="p-2" asChild>
                  <a aria-label="User Profile">
                    <UserCircle color="pink" size={40} />
                  </a>
                </Button>
              </Link>
            </div>
            <div className="p-2">
              {" "}
              {/* 追加されたラッパー div */}
              <WalletMultiButton />
            </div>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="content-area"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black border-b overflow-hidden"
                style={{ width: "500px", position: "absolute", top: "100%" }}
              >
                <div className="container mx-auto px-4 py-8">
                  <Link href={`/create-label`} onClick={handleLinkClick}>
                    <div className="flex items-center justify-center h-24">
                      <p className="text-lg font-medium">Label を作成</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="flex-grow overflow-auto"
        style={{ marginTop: "80px", marginBottom: "68px" }}
      >
        {" "}
        {/* Top Barの高さに合わせて調整 */}
        <AppContent>{children}</AppContent>
      </div>

      {/* Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t p-2"
        style={{ width: "500px", margin: "0 auto" }}
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/explore" passHref>
            <Button variant="ghost" size="lg" className="p-2" asChild>
              <a aria-label="Explore">
                <Globe color="pink" size={40} />
              </a>
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button variant="ghost" size="lg" className="p-2" asChild>
              <a aria-label="User Profile">
                <UserCircle color="pink" size={40} />
              </a>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}
