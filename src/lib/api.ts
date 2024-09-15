import { ActorForm } from "@/components/actors-form";

export async function postLabel(initialMembers: string[]) {
  const data = {
    initialMembers: initialMembers,
  };

  const response = await fetch(
    "http://localhost:3000/api/label/create-label",
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
    "http://localhost:3000/api/user/create-user",
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
    "http://localhost:3000/api/film",
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