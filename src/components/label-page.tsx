"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import Link from "next/link";
import { Actor, fetchFilm, fetchLabel } from "../../anchorClient";
import * as web3 from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchFlyer, fetchMasterCopy, filterNodeWallet, Flyer } from "@/lib/utils";
import {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
} from "@sqds/sdk";
import { BN } from "@project-serum/anchor"; // 追加

interface LabelPageProps {
  wallet: AnchorWallet;
  labelPda: web3.PublicKey;
}

interface LabelAccountData {
  squadKey: web3.PublicKey;
  bubblegumTree: web3.PublicKey;
  films: web3.PublicKey[];
}

interface FilmAccountData {
  collectionMint: web3.PublicKey,
  label: web3.PublicKey,
  actor: Actor,
}

export function LabelPage({ wallet, labelPda }: LabelPageProps) {
  const [layout, setLayout] = useState("single");
  const [labelData, setLabelData] = useState<LabelAccountData | null>(null);
  const [member, setMember] = useState<string[]>([]);
  const [filmDatas, setFilmDatas] = useState<FilmAccountData[]>([]);
  const [flyers, setFlyers] = useState<Flyer[] | null>([]);
  const [vault, setVault] = useState<web3.PublicKey>();
  const [masterCopys, setMasterCopys] = useState<string[]>([]);  


  useEffect(() => {
    async function getLabelData() {
      const data = await fetchLabel(wallet, labelPda);
      console.log(data);
      setLabelData(data);
    }
    getLabelData();
  }, [labelPda, wallet]);

  useEffect(() => {
    async function fetchSquadData() {
      if (labelData?.squadKey) {
        try {
          const response = await fetch(
            `/api/label/${labelData.squadKey.toString()}`
          );
          const data = await response.json();
          // console.log(data);
          const msState = data.multisigAccount;
          console.log(msState)
          const filteredMembers = filterNodeWallet(msState.keys);
          setMember(filteredMembers);
        } catch (error) {
          console.error("Failed to fetch squad data:", error);
        }
      }
    }
    fetchSquadData();
  }, [labelData]);

  useEffect(() => {
    async function fetchFilms() {
      if (labelData?.films) {
        try {
          const filmDataPromises = labelData.films.map(filmPda => fetchFilm(wallet, filmPda));
          const filmsData = await Promise.all(filmDataPromises);
          console.log(filmsData);
          setFilmDatas(filmsData);
        } catch (error) {
          console.error("フィルムデータの取得中にエラーが発生しました:", error);
        }
      }
    }
    fetchFilms();
  }, [labelData, wallet]);

  useEffect(() => {
    async function fetchFlyers() {
      try {
        const flyerPromises = filmDatas.map(film => fetchFlyer(film.collectionMint));
        const flyers = await Promise.all(flyerPromises);
        setFlyers(flyers);
      } catch (error) {
        console.error("フライヤーデータの取得中にエラーが発生しました:", error);
      }
    }
    fetchFlyers();
  }, [filmDatas]);

  useEffect(() => {
    const fetchVault = async () => {
      if (labelData?.squadKey) {
        const [vault] = await getAuthorityPDA(
          labelData.squadKey,
          new BN(1),
          DEFAULT_MULTISIG_PROGRAM_ID
        );
        setVault(vault);
      }
    };
    fetchVault();
  }, [labelData]);

  useEffect(() => {
    async function fetchMaster() {
      if (vault) {
        try {
          const data = await fetchMasterCopy(vault);
          setMasterCopys(data || []);

        } catch (error) {
          console.error("マスターコピーの取得中にエラーが発生しました:", error);
        }
      }
    }
    fetchMaster();
  }, [vault]);

  const renderItems = (items: Flyer[]) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent
            className={`p-4 ${
              layout === "single" ? "flex items-center space-x-4" : "space-y-3"
            }`}
          >
            <div
              className={`${
                layout === "single" ? "w-1/3" : "w-full"
              } aspect-square`}
            >
              <img
                src={item.image}
                alt={`${item.name} image`}
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
              {item.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src="/placeholder.svg?text=C&width=100&height=100"
                  alt="User avatar"
                  width={100}
                  height={100}
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Chapl1n</h2>
                <div className="mt-2 flex space-x-4">
                  <div>
                    <span className="font-semibold">3</span> Films
                  </div>
                  <div>
                    <span className="font-semibold">150</span> Crew
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="icon" aria-label="Discord">
              <Discord className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </Button>
          </div> */}
        </CardHeader>
      </Card>

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="film">Film</TabsTrigger>
          <TabsTrigger value="member">Squad</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>
        <TabsContent value="film">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-2">
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
          </div>
          {renderItems(flyers ?? [])}
        </TabsContent>
        <TabsContent value="member">
          {member.length > 0 ? (
            <div>
              {member.map((member, index) => (
                <div key={index}>{member.toString()}</div>
              ))}
              {member.includes(wallet.publicKey.toString()) && (
                <Link href={`/label/new-film/${labelPda}`}>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Film
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div>No members available</div>
          )}
        </TabsContent>
        <TabsContent value="treasury">
          <h2>treasury address</h2>
          <h2>{vault?.toString()}</h2>
          <h2>owned master copy (collection mint)</h2>
          {masterCopys.map((copy, index) => (
            <div key={index}>{copy}</div> // 追加
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
