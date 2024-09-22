
// import * as web3 from "@solana/web3.js";
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { LayoutGrid, LayoutList } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { fetchUser } from "../../anchorClient";
// import { useAnchorWallet } from "@solana/wallet-adapter-react";

// export function UserPage() {
//   const [layout, setLayout] = useState("single");
//   const [userAccount, setUserAccount] = useState<{ userAccount: { name: string; labels: web3.PublicKey[] }; userPda: web3.PublicKey } | null>(null);
//   const wallet = useAnchorWallet();

//   useEffect(() => {
//     const fetchUserAccount = async () => {
//       if (wallet) {
//         const mockAddress = new web3.PublicKey("4Pv8xnSwJ4ZZ8yeo2rmNfBznLrGZojic9RuXi8d1Li71");
//         const account = await fetchUser(wallet, mockAddress);
//         console.log(account);
//         const userAccountData = {
//           name: account.userAccount.name,
//           labels: account.userAccount.labels.map((label: string) => new web3.PublicKey(label))
//         };
//         setUserAccount({ userAccount: userAccountData, userPda: account.userPda });
//       }
//     };

//     fetchUserAccount();
//   }, [wallet]);

//   interface Item {
//     image: string;
//     name: string;
//   }

//   const histories: Item[] = [
//     { image: "/radar.jpg", name: "Film1" },
//     { image: "/radar.jpg", name: "Film2" },
//     { image: "/radar.jpg", name: "Film3" },
//   ];

//   const renderItems = (items: Item[]) => (
//     <div
//       className={`grid gap-4 ${
//         layout === "double" ? "grid-cols-2" : "grid-cols-1"
//       }`}
//     >
//       {items.map((item, index) => (
//         <Card key={index}>
//           <Link href={`/label`}>
//             <CardContent
//               className={`p-4 ${
//                 layout === "single"
//                   ? "flex items-center space-x-4"
//                   : "space-y-3"
//               }`}
//             >
//               <div
//                 className={`${
//                   layout === "single" ? "w-1/3" : "w-full"
//                 } aspect-square`}
//               >
//                 <Image
//                   src={item.image}
//                   alt={`${item.name} image`}
//                   width={500}
//                   height={500}
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               </div>
//               <h3
//                 className={`text-lg font-semibold ${
//                   layout === "single" ? "flex-1" : "text-center"
//                 }`}
//               >
//                 {item.name}
//               </h3>
//             </CardContent>
//           </Link>
//         </Card>
//       ))}
//     </div>
//   );

//   return (
//     <div className="w-full max-w-md mx-auto space-y-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center space-x-4 pb-2">
//           <Avatar className="w-20 h-20">
//             <AvatarImage
//               src="/chaplin.png"
//               alt="User avatar"
//               width={100}
//               height={100}
//             />
//             <AvatarFallback>UN</AvatarFallback>
//           </Avatar>
//           <h2 className="text-2xl font-bold">{userAccount?.userAccount.name}</h2>
//         </CardHeader>
//         <CardContent>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-medium">Deposit</span>
//                 <span className="text-2xl font-bold">100</span>
//               </div>
//             </CardContent>
//           </Card>
//         </CardContent>
//       </Card>

//       <Tabs defaultValue="label" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="label">Label</TabsTrigger>
//           <TabsTrigger value="history">History</TabsTrigger>
//         </TabsList>
//         <TabsContent value="label">
//           <div className="mb-4 flex justify-end space-x-2">
//             <Button
//               variant={layout === "single" ? "default" : "ghost"}
//               size="icon"
//               onClick={() => setLayout("single")}
//               aria-label="1列表示"
//             >
//               <LayoutList className="h-4 w-4" />
//             </Button>
//             <Button
//               variant={layout === "double" ? "default" : "ghost"}
//               size="icon"
//               onClick={() => setLayout("double")}
//               aria-label="2列表示"
//             >
//               <LayoutGrid className="h-4 w-4" />
//             </Button>
//           </div>
//           {renderItems(userAccount?.userAccount.labels.map((label, index) => ({
//             image: "/radar.jpg",
//             name: `Label ${index + 1}`
//           })) || [])}
//         </TabsContent>
//         <TabsContent value="history">
//           <div className="mb-4 flex justify-end space-x-2">
//             <Button
//               variant={layout === "single" ? "default" : "ghost"}
//               size="icon"
//               onClick={() => setLayout("single")}
//               aria-label="1列表示"
//             >
//               <LayoutList className="h-4 w-4" />
//             </Button>
//             <Button
//               variant={layout === "double" ? "default" : "ghost"}
//               size="icon"
//               onClick={() => setLayout("double")}
//               aria-label="2列表示"
//             >
//               <LayoutGrid className="h-4 w-4" />
//             </Button>
//           </div>
//           {renderItems(histories)}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

"use client";

import * as web3 from "@solana/web3.js";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchUser } from "../../anchorClient";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import UserCardV3 from "./user/user-card-vol3";

export default function UserPage() {
  const [layout, setLayout] = useState("single");
  const [userAccount, setUserAccount] = useState<{ userAccount: { name: string; label: web3.PublicKey[] }; userPda: web3.PublicKey } | null>(null);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const fetchUserAccount = async () => {
      if (wallet) {
        const authority = wallet.publicKey
        const account = await fetchUser(wallet, authority);
        setUserAccount(account);
      }
    };

    fetchUserAccount();
  }, [wallet]);

  const renderItems = (items: web3.PublicKey[]) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Card key={index}>
          <Link href={`/label/${item.toBase58()}`}>
            <CardContent
              className={`p-4 ${
                layout === "single"
                  ? "flex items-center space-x-4"
                  : "space-y-3"
              }`}
            >
              <div
                className={`${
                  layout === "single" ? "w-1/3" : "w-full"
                } aspect-square`}
              >
                <Image
                  src="/radar.jpg"
                  alt={`Label ${index + 1} image`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  layout === "single" ? "flex-1" : "text-center"
                }`}
              >
                {item.toBase58().slice(0, 8)}...
              </h3>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <UserCardV3 wallet={wallet || null}/>

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="label">ラベル</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="label">
          <div className="mb-4 flex justify-end space-x-2">
            <Button
              variant={layout === "single" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("single")}
              aria-label="1列表示"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "double" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("double")}
              aria-label="2列表示"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          {userAccount ? renderItems(userAccount.userAccount.label) : <p>Loading labels...</p>}
        </TabsContent>
        <TabsContent value="history">
          <div className="mb-4 flex justify-end space-x-2">
            <Button
              variant={layout === "single" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("single")}
              aria-label="1列表示"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "double" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("double")}
              aria-label="2列表示"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <p>History functionality not implemented yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}