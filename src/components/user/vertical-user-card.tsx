import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Avatar from "boring-avatars";
import { UserSet } from "../../../anchorClient";
import { useClientPopcorn } from "@/ClientPopcornContext";

const VerticalUserCard: FC<{ userAccount: UserSet }> = ({ userAccount }) => {
  const { clientATAInfo } = useClientPopcorn();
  return (
    <>
      {userAccount && (
        <Card className="w-full bg-black mx-6 shadow-none">
      <CardHeader className="flex flex-col items-center space-y-4 pb-2">
        <Avatar
          name={userAccount.userAccount.name}
          colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]}
          variant="pixel"
          size={80}
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            {userAccount.userAccount.name}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="text-white">
        <div className="text-center font-medium mb-6">
          {clientATAInfo?.amount ? (

              <span className="flex items-center justify-center text-2xl">
                <span className="mr-2 text-3xl">🍿</span>
                <span className="font-bold">
                  {(Number(clientATAInfo.amount) / 10 ** 9).toFixed(4)}
                </span>
                <span className="ml-2 text-xl">POP</span>
              </span>
          ) : (
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <span className="text-2xl font-bold">0.0000 POP</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="text-center">
            <p className="text-3xl font-bold">
              {userAccount.userAccount.label.length}
            </p>
            <p className="text-sm mt-1 text-gray-300">Labels</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {userAccount.userAccount.history.length}
            </p>
            <p className="text-sm mt-1 text-gray-300">History</p>
          </div>
        </div>
      </CardContent>
    </Card>
      )}
    </>
  );
};

export default VerticalUserCard;
