"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function TopBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-2 flex justify-center items-center">
          <button
            className="text-lg font-bold hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="content-area"
          >
            chapl1n
          </button>
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
            className="bg-black bg-opacity-50 border-b overflow-hidden"
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
      <WalletMultiButton style={{}} />
    </div>
  );
}
