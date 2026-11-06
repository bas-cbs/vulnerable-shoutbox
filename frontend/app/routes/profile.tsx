import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shoutbox" },
    { name: "description", content: "Shout whatever you want!" },
  ];
}

export async function getProfile({ username }) {
  const res = await fetch(`http://localhost:8000/v2/profiles/${username}`, {
    method: "GET",
  });
  if (res.ok) {
    return await res.json();
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getProfile({ username: params.username });
}

export function HydrateFallback() {
  return <div>Loading...</div>;
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
