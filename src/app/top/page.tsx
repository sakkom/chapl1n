"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import EnterCard from "@/components/enter-card";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Faucet from "@/components/faucet";

export default function Component() {
  const wallet = useAnchorWallet();
  const [activeSection, setActiveSection] = useState("problem");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["problem", "solution", "prototype"];
      const scrollPosition = window.scrollY + 100; // Offset for the header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for the header
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="py-4 px-4 md:px-8 lg:px-16 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold">Chapl1n</h1>
              <p className="text-xl font-bold text-[#9945FF] mt-2">
                Internet theater for independent & subculture
              </p>
            </div>
            <nav>
              <ul className="flex space-x-6">
                {[
                  { name: "Problem", emoji: "❗" },
                  { name: "Solution", emoji: "💡" },
                  { name: "Prototype", emoji: "🚀" },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      className={`text-base font-bold transition-colors duration-200 ease-in-out
                        ${
                          activeSection === item.name.toLowerCase()
                            ? "text-[#9945FF] border-b-2 border-[#9945FF]"
                            : "text-gray-600 hover:text-[#9945FF]"
                        }`}
                      onClick={() => scrollToSection(item.name.toLowerCase())}
                    >
                      {item.emoji} {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-32">
        <section id="problem" className="relative">
          <div className="absolute -left-4 top-0 w-0.5 h-full bg-gray-200"></div>
          <h2 className="text-4xl font-extrabold mb-6 flex items-center">
            <span className="text-[#9945FF] mr-4 text-2xl">❗</span>
            Problem
          </h2>
          <h3 className="text-5xl font-extrabold mb-6 text-[#9945FF]">
            The Unsustainability of Wild Labels
          </h3>
          <p className="text-2xl font-bold leading-relaxed text-gray-700">
            Ad-tech and subscription models work for mainstream culture but
            don&apos;t fit indie and subcultural creators, who rely on niche
          </p>
        </section>

        <section id="solution" className="relative">
          <div className="absolute -left-4 top-0 w-0.5 h-full bg-[#9945FF]/20"></div>
          <h2 className="text-4xl font-extrabold mb-6 flex items-center">
            <span className="text-[#9945FF] mr-4 text-2xl">💡</span>
            Solution
          </h2>
          <h3 className="text-5xl font-extrabold mb-6 text-[#9945FF]">
            Viewers drive the Next Film
          </h3>
          <ul className="space-y-6 text-2xl font-bold text-gray-700">
            <li>
              Films earn cryptocurrency with each view.{" "}
              <span className="text-[#9945FF] font-extrabold">
                (Now Available)
              </span>
            </li>
            <li>
              Viewers can join labels as a production committee through NFTs{" "}
              <span className="text-gray-500 font-semibold">(coming soon)</span>
            </li>
            <li>
              An automatic accelerator program runs as view counts grow{" "}
              <span className="text-gray-500 font-semibold">(coming soon)</span>
            </li>
          </ul>
        </section>

        <section id="prototype" className="relative">
          <div className="absolute -left-4 top-0 w-0.5 h-full bg-gray-200"></div>
          <h2 className="text-4xl font-extrabold mb-6 flex items-center">
            <span className="text-[#9945FF] mr-4 text-2xl">🚀</span>
            Prototype{" "}
            <span className="text-[#9945FF] ml-2 text-2xl font-extrabold">
              (Now Available)
            </span>
          </h2>
          <div className="space-y-8">
            {[
              {
                title: "view on crypto",
                emoji: "👀",
                description:
                  "Experience a new way of viewing content, powered by cryptocurrency. Each view contributes directly to the film's success and creator's earnings.",
              },
              {
                title: "Box office Distribution",
                emoji: "🎬",
                description:
                  "Transparent and fair distribution of earnings. Creators receive their share based on real-time viewership data, ensuring immediate compensation.",
              },
              {
                title: "Flyer Network",
                emoji: "🌐",
                description:
                  "Connect with like-minded individuals and promote indie films. Our decentralized network empowers enthusiasts to support and spread the word about their favorite content.",
              },
            ].map((item, index) => (
              <details key={index} className="group">
                <summary className="flex items-center cursor-pointer">
                  <ChevronRight className="w-6 h-6 mr-2 transition-transform group-open:rotate-90 text-[#9945FF]" />
                  <h3 className="text-3xl font-extrabold text-gray-800">
                    {item.emoji} {item.title}
                  </h3>
                </summary>
                <p className="mt-4 ml-8 text-2xl font-bold leading-relaxed text-gray-700">
                  {item.description}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <EnterCard wallet={wallet ?? null} />
          </div>
          <div className="w-full lg:w-1/2">
            <Faucet publicKey={wallet?.publicKey ?? null} />
          </div>
        </section>
      </main>
    </div>
  );
}
