

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