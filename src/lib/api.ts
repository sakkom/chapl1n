import { ActorForm } from "@/components/actors-form";
import { Actor } from "../../anchorClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postLabel(initialMembers: string[]) {
  const data = {
    initialMembers: initialMembers,
  };

  const response = await fetch(
    `${API_URL}/label/create-label`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function postUserProfile(authority: string, name: string) {
  const data = {
    authority,
    name
  };

  const response = await fetch(
    `${API_URL}/user/create-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function postFilm(flyer: File, labelPda: string, msPda: string, actor: ActorForm) { 
  const formData = new FormData();
  formData.append('flyer', flyer);
  formData.append('labelPda', labelPda);
  formData.append('msPda', msPda);
  formData.append('actor', JSON.stringify(actor));

  const response = await fetch(
    `${API_URL}/film`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function executeTxNode(txPda: string) {

  const response = await fetch(
    `${API_URL}/label/msTxs/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(txPda),
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json() ;
}

export async function getCredit(msPda: string) {
  const response = await fetch(`${API_URL}/label/msTxs/${msPda}`, {method: "GET"});

  if(!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function postAirdrop(clientPubkey: string) {
  
  const response = await fetch(
    `${API_URL}/faucet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientPubkey),
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json() ;
}

export async function postHisotyNFT(client: string, collectionMint: string, merkleTree: string) { 
  const formData = new FormData();
  formData.append('client', client); 
  formData.append('collectionMint', collectionMint);
  formData.append('merkleTree', merkleTree); 

  const response = await fetch(
    `${API_URL}/film/history`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function postSettlement(clientATA: string, actor: Actor, label: string, amount: number, historyOwner?: string) { 
  const formData = new FormData();

  formData.append('clientATA', clientATA);

  actor.creator.forEach((creator) => {
    formData.append(`creator`, creator.toString());
  });

  actor.coCreator.forEach((coCreator) => {
    formData.append(`coCreator`, coCreator.toString());
  });

  console.log(amount.toString);
  formData.append('label', label);
  formData.append('amount', amount.toString());

  if(historyOwner) formData.append('historyOwner', historyOwner);

  const response = await fetch(
    `${API_URL}/film/settlement`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}


