"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewModal({ isOpen, onClose }: ViewModalProps) {
  const [isPublic, setIsPublic] = useState(false);

  const handleView = () => {
    console.log(
      `視聴開始: ステータス ${isPublic ? "パブリック" : "プライベート"}`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
            視聴確認
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-center">
            履歴を公開して視聴しますか？
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between space-x-4">
            <Label
              htmlFor="public-mode"
              className="text-sm font-medium text-gray-700 flex items-center space-x-2"
            >
              {isPublic ? (
                <EyeIcon className="w-5 h-5 text-green-500" />
              ) : (
                <EyeOffIcon className="w-5 h-5 text-red-500" />
              )}
              <span>
                {isPublic ? "パブリックモード" : "プライベートモード"}
              </span>
            </Label>
            <Switch
              id="public-mode"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
            />
          </div>
        </div>
        <div className="mt-6">
          <Link href={`/theater`}>
            <Button
              onClick={handleView}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            >
              視聴する
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
