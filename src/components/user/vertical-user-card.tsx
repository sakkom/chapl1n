import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Avatar from "boring-avatars";
import { UserSet } from "../../../anchorClient";
import { useClientPopcorn } from "@/ClientPopcornContext";



const VerticalUserCard: FC<{ userAccount: UserSet }> = ({ userAccount }) => {
const { clientATAInfo} = useClientPopcorn();  
  return (
    <>
      {userAccount && (
        <Card className="w-full bg-transparent shadow-none">
          <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <Avatar
              name="Helen Keller"
              colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
              variant="marble"
              size={80}
            />
            <div className="text-center text-white">
              <h2 className="text-xl font-bold">{userAccount.userAccount.name}</h2>
            </div>
          </CardHeader>
          <CardContent>
            {clientATAInfo?.amount ? <>🍿{clientATAInfo.amount.toString()}POP</> : "0.000"}
            <div className="grid grid-cols-2 gap-8 mt-6 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold">{userAccount.userAccount.label.length}</p>
                <p className="text-sm mt-1">Label</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{userAccount.userAccount.history.length}</p>
                <p className="text-sm mt-1">History</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default VerticalUserCard;