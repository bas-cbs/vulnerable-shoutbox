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
          <div>
            <div className="space-y-4">
              <div>
                <h2 className="truncate text-2xl font-semibold">
                  {params.username}
                </h2>
                <p className="truncate text-sm text-gray-500">
                  {profile?.email ?? "No email registered"}
                </p>
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Profile description
                </h3>
                <p>{profile?.description ?? "Missing profile description"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
