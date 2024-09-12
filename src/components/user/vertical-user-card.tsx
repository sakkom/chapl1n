import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { web3 } from "@coral-xyz/anchor";
import Avatar from "boring-avatars";

interface UserAccountProps {
  userAccount: {
    name: string;
    label: web3.PublicKey[];
  };
  userPda: web3.PublicKey;
}

const VerticalUserCard: FC<{ userAccount: UserAccountProps }> = ({ userAccount }) => {
  return (
    <>
      {userAccount && (
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <Avatar
              name="Helen Keller"
              colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
              variant="marble"
              size={80}
            />
            <div className="text-center">
              <h2 className="text-xl font-bold">{userAccount.userAccount.name}</h2>
              <p className="text-sm text-muted-foreground">PDA: {userAccount.userPda.toString()}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground mt-1">Label</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">10</p>
                <p className="text-sm text-muted-foreground mt-1">History</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default VerticalUserCard;