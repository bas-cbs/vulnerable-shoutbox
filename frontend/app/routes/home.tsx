import type { Route } from "./+types/home";
import { Posts, CreatePost } from "../posts/posts";
import { useState } from "react";
import { SignIn } from "../signin/signin";

export async function getPosts() {
  const res = await fetch("http://localhost:8000/posts");
  const posts = await res.json();
  return posts;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getPosts();
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shoutbox" },
    { name: "description", content: "Shout whatever you want!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [posts, setPosts] = useState(loaderData);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  });

  async function createPost({ user, body }) {
    await fetch("http://localhost:8000/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, content: body }),
    });

    setPosts(await getPosts());
  }

  async function deletePost({ id }) {
    await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
    });

    setPosts(await getPosts());
  }

  async function editPost({ id, content }) {
    await fetch(`http://localhost:8000/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content }),
    });

    setPosts(await getPosts());
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>Shoutbox</h1>
        </header>
        <div className="max-w-[800px] w-full space-y-6 px-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
          <SignIn
            token={token}
            setToken={setToken}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
          <div className="flex justify-center">
            <CreatePost createPost={createPost} />
          </div>
          <Posts postData={posts} deletePost={deletePost} editPost={editPost} />
        </div>
      </div>
    </main>
  );
}
