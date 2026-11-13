import { API_URL, THIRD_PARTY_API_URL } from "./config";

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  return posts;
}

export async function getRaffleReg() {
  const res = await fetch(`${API_URL}/raffle`);
  return await res.json();
}

export async function getProfile({ username }) {
  const res = await fetch(`${API_URL}/profiles/${username}`, {
    method: "GET",
    headers: {
      "X-Description-Source": THIRD_PARTY_API_URL,
    },
  });
  if (res.ok) {
    return await res.json();
  }
}
