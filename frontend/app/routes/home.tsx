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

  async function createPost({ body }) {
    await fetch("http://localhost:8000/post/create", {
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
    await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts(await getPosts());
  }

  async function editPost({ id, content }) {
    await fetch(`http://localhost:8000/post/${id}`, {
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
        <SignIn
          token={token}
          setToken={setToken}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        <div className="max-w-[800px] w-full rounded-3xl border border-gray-200 p-6 space-y-4">
          <div className="rounded border border-gray-200 space-y-4 p-4">
            <span className="flex flex-row items-center">
              <b>{userInfo.username ?? "anonymous"}</b>:&nbsp;
              <CreatePost createPost={createPost} />
            </span>
          </div>
          <Posts
            postData={posts}
            deletePost={deletePost}
            editPost={editPost}
            userInfo={userInfo}
          />
        </div>
      </div>
    </main>
  );
}
