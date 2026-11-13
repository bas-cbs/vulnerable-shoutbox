import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Upload } from "lucide-react";
import { useState } from "react";
import { API_URL, THIRD_PARTY_API_URL } from "../config";
import { getProfile } from "../getters";
import { useContext } from "react";
import { UserContext } from "../context";

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
  const [uploadResponse, setUploadResponse] = useState({});
  const { user, token } = useContext(UserContext);

  async function postPhotoUrl({ url }) {
    const res = await fetch(`${API_URL}/upload_photo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: url }),
    });

    if (res.ok) {
      return await res.json();
    }
  }

  async function handlePhotoUrl(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const url = formData.get("url");

    if (url) {
      setUploadResponse(await postPhotoUrl({ url: url }));
    }
  }

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
              {user == params.username && (
                <div className="space-y-4">
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Profile photo upload
                    </h3>
                    <form onSubmit={handlePhotoUrl}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="url"
                          name="url"
                          placeholder="url"
                          className="border border-gray-300 y-2 p-2"
                        />
                        <button type="submit">
                          <Upload />
                        </button>
                      </div>
                    </form>
                    {Object.keys(uploadResponse).length > 0 && (
                      <div>
                        <p>
                          {uploadResponse.status_code == "200"
                            ? "An admin will check your upload soon..."
                            : "Upload failed"}
                        </p>
                        <code>
                          <ul>
                            <li>http_version: {uploadResponse.http_version}</li>
                            <li>status_code: {uploadResponse.status_code}</li>
                            <li>url: {uploadResponse.url}</li>
                          </ul>
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
