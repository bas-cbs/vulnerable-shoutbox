import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Posts, CreatePost } from "../posts/posts";
import { useState } from "react";
import { SignIn } from "../signin/signin";
import { Ticket } from "lucide-react";
import { getPosts } from "../getters";
import { API_URL } from "../config";
import { useContext } from "react";
import { UserContext } from "../context";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getPosts();
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shoutbox" },
    { name: "description", content: "Shout whatever you want!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, token } = useContext(UserContext);
  const [posts, setPosts] = useState(loaderData);

  async function createPost({ body }) {
    await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: body }),
    });

    setPosts(await getPosts());
  }

  async function deletePost({ id }) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts(await getPosts());
  }

  async function editPost({ id, content }) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: content }),
    });

    setPosts(await getPosts());
  }

  return (
    <main className="pt-16">
      <div className="flex flex-col items-center gap-8">
        <header>
          <h1 className="font-mono text-3xl italic">shoutbox</h1>
        </header>
        {`TEST ${user}`}
        <SignIn />
        <div className="max-w-[800px] w-full rounded-3xl border border-gray-200 p-6 space-y-4">
          <div className="rounded border border-gray-200 space-y-4 p-4">
            <span className="flex flex-row items-center">
              <b>{user ?? "anonymous"}</b>:&nbsp;
              <CreatePost createPost={createPost} />
            </span>
          </div>
          <Posts postData={posts} deletePost={deletePost} editPost={editPost} />
        </div>
      </div>
      <Link
        to="/raffle"
        className="inline-flex gap-2 fixed right-6 bottom-6 z-50 rounded-full bg-violet-600 px-5 py-3
                 font-semibold text-white"
      >
        Enter the raffle! <Ticket />
      </Link>
    </main>
  );
}
