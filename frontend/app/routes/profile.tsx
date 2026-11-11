import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState } from "react";
import { THIRD_PARTY_API_URL } from "../config";
import { getProfile } from "../getters";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shoutbox" },
    { name: "description", content: "Shout whatever you want!" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getProfile({ username: params.username });
}

export default function Profile({ loaderData, params }: Route.ComponentProps) {
  const [profile, setProfile] = useState(loaderData);

  return (
    <main className="pt-16">
      <div className="flex flex-col items-center gap-8">
        <header>
          <Link to="/">
            <h1 className="font-mono text-3xl italic">shoutbox</h1>
          </Link>
        </header>
        <div className="max-w-[800px] w-full rounded-3xl border border-gray-200 p-6 space-y-4">
          {profile ? (
            <div>
              <p>
                <b>{profile.username}</b> ({profile.email})
              </p>
              <p>{profile.description}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Description sourced from {THIRD_PARTY_API_URL}
              </p>
            </div>
          ) : (
            <div>
              <p>
                <b>{params.username}</b>
              </p>
              <p>Missing profile description</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
