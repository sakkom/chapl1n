
"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flyer } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Clock, Popcorn } from "lucide-react";
import { useRouter } from "next/navigation";


export function MockCard ({
  flyer,
  amount,
  index,
}: {
  flyer: Flyer;
  amount: number;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // 256777783 demo bigint
  const beforeAmount = (Number(amount) / 10 ** 9).toFixed(4);
  const afterAmount = (Number(BigInt(amount) - BigInt(15000000000)) / 10 ** 9).toFixed(4);

  const getTitleContent = (index: number) => {
    if (index === 0) {
      return (
        <>
          <span className="mr-2">15sec: 🍿 15 POP </span>
        </>
      );
    } else if (index === 1) {
      return (
        <>
          <span className="mr-2">20min: 🍿 1200 POP</span>
        </>
      );
    } else {
      return (
        <>
          <span className="mr-2">25min | 🍿 1500 POP</span>
        </>
      );
    }
  };

  const handleEnter = (filmPdaStr: string) => {
    router.push(`/theater/${filmPdaStr}`); // Replace with the actual path you want to navigate to
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          key={flyer.filmPda.toString()}
          className="overflow-hidden shadow-lg mb-4 mx-1 cursor-pointer transition-transform duration-200 hover:scale-105 bg-black text-white"
        >
          <CardHeader className="p-2 bg-gray-900">
            <CardTitle className="text-xs sm:text-sm font-bold flex items-center text-white space-x-2">
              {getTitleContent(index)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <img
              src={flyer.image}
              alt={flyer.name}
              className="w-full h-full object-cover aspect-square"
            />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-white">
            Admission Check
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-white" />
            <span>15 sec</span>
            <Popcorn className="h-5 w-5 text-white" />
            <span>15 POP</span>
          </div>
          <div className="grid gap-4 p-4 border-2 border-white rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Balance:</span>
              <span className="font-bold text-lg">🍿 {beforeAmount} POP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">After Balance:</span>
              <span className="font-bold text-lg">🍿 {afterAmount} POP</span>
            </div>
          </div>
          {Number(afterAmount) > 0 ? (
            <Button
              className="w-full mt-2 bg-[#14F195] hover:bg-[#0fd584] text-gray-900"
              size="lg"
              onClick={() => handleEnter(flyer.filmPda.toString())}
            >
              Enter
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-red-400 mb-2">Insufficient Pops</p>
              <Button
                className="w-full mt-2 bg-[#14F195] hover:bg-[#0fd584] text-gray-900 opacity-50 cursor-not-allowed"
                size="lg"
                disabled
              >
                Enter
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
