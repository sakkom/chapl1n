'use client'

import { useAnchorWallet } from "@solana/wallet-adapter-react"
import Image from "next/image"
import { motion } from "framer-motion"
import EnterCard from "@/components/enter-card"

export default function Page() {
  const wallet = useAnchorWallet()

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-y-auto py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 text-center">
            <h1 className="text-6xl">🍿</h1>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Chapl1n
            </h1>
            <p className="text-2xl mb-6 text-gray-300">
              the web3 internet theater
            </p>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              It works as a box office revenue distribution system that also
              accelerates creators.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="w-full relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/dist.jpeg"
              alt="Distribution Illustration"
              width={1920}
              height={1080}
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col"
          >
            <div className="flex-grow">
              <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                Problem & Missions
              </h2>
              <ul className="space-y-8 text-gray-300">
                {[
                  { icon: "🔗", text: "Smart Contract Integration for trustless transactions" },
                  { icon: "💾", text: "Decentralized Storage ensuring data integrity" },
                  { icon: "🌐", text: "Community Governance for true decentralization" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="mr-4 text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="text-xl group-hover:text-white transition-colors duration-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-stretch"
          >
            <div className="w-full max-w-md flex flex-col">
              <EnterCard wallet={wallet ?? null} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}