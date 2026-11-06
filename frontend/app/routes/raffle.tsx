import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { SignIn } from "../signin/signin";

export async function getRaffleReg() {
  const res = await fetch("http://localhost:8000/v2/raffle");
  return await res.json();
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getRaffleReg();
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

export default function Raffle({ loaderData }: Route.ComponentProps) {
  const [raffleReg, setRaffleReg] = useState(loaderData);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({
    username: localStorage.getItem("username"),
  });
  const emptyRows = Array.from({ length: 10 - raffleReg.length });

  async function registerRaffle() {
    await fetch("http://localhost:8000/v2/raffle/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setRaffleReg(await getRaffleReg());
  }

  function handleRaffleReg(e) {
    e.preventDefault();
    registerRaffle();
  }

  return (
    <main className="pt-16">
      <div className="flex flex-col items-center gap-8">
        <header>
          <Link to="/">
            <h1 className="font-mono text-3xl italic">shoutbox</h1>
          </Link>
        </header>
        <SignIn
          token={token}
          setToken={setToken}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        <div className="max-w-[800px] w-full rounded-3xl border border-gray-200 p-6 space-y-4">
          <b>Register for the raffle to win amazing prices!</b>
          <p>
            The raffle start when 10 users have registered. Only logged in users
            can register
          </p>
          {token && (
            <button
              onClick={handleRaffleReg}
              disabled={token ? false : true}
              className="inline-flex gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white cursor-pointer"
            >
              Enter Raffle <Ticket />
            </button>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <tr>
              <th>Registration ID</th>
              <th>Username</th>
            </tr>
            {raffleReg.map(({ id, username }) => (
              <tr>
                <td>{id}</td>
                <td>{username}</td>
              </tr>
            ))}
            {emptyRows.map(() => (
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </main>
  );
}
