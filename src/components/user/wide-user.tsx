import { Card, CardContent, } from "@/components/ui/card";
import { FC, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchUser, UserSet } from "../../../anchorClient";
import Avatar from "boring-avatars";
import Link from "next/link";

interface WideUserProps {
  authority: PublicKey;
  wallet: AnchorWallet;
}

export const WideUser: FC<WideUserProps> = ({ authority, wallet }) => {
  const [user, setUser] = useState<UserSet>();

  useEffect(() => {
    async function fetchUserAccount() {
      const data = await fetchUser(wallet, authority);
      setUser(data);
    }

    fetchUserAccount();
  }, [wallet, authority]);

  return (
    <div>
      {user ? (
        <Link href={`/profile/${user.userPda.toString()}`}>
                <Card className=" hover:bg-slate-800">
          <CardContent className="flex items-center space-x-4 p-4 ">
            <Avatar
              name={user.userAccount.name}
              colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
              variant="marble"
              size={50}
            />
            <div>
              <h2 className="text-lg font-semibold text-white">{user.userAccount.name}</h2>
            </div>
          </CardContent>
        </Card>
        </Link>

      ) : (
        <div>アカウント取得中</div>
      )}
    </div>
  );
};
