import type { Route } from "./+types/home";
import { Posts, CreatePost } from "../posts/posts";
import { useState } from "react";
import { SignIn } from "../signin/signin";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shoutbox" },
    { name: "description", content: "Shout whatever you want!" },
  ];
}

export default function Home({ params }: Route.ComponentProps) {
  return (
    <main className="pt-16">
      <div className="flex flex-col items-center gap-8">
        <header>
          <Link to="/">
            <h1 className="font-mono text-3xl italic">shoutbox</h1>
          </Link>
        </header>
        <div className="max-w-[800px] w-full rounded-3xl border border-gray-200 p-6 space-y-4">
          <div className="rounded border border-gray-200 space-y-4 p-4">
            <b>{params.name}</b>
          </div>
          <p>description</p>
        </div>
      </div>
    </main>
  );
}
