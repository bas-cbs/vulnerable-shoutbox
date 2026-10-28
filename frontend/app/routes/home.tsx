import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch("http://localhost:8000/posts");
  const product = await res.json();
  return product;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>Shoutbox</h1>
        </header>
        <div className="max-w-[800px] w-full space-y-6 px-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
          <Welcome postData={loaderData} />
        </div>
      </div>
    </main>
  );
}
