import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
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

export default function Home({loaderData}: Route.ComponentProps) {
	console.log("loaderData:", loaderData);
	loaderData.map(({postid, content}) => (
		console.log(content)
	))
  return <Welcome />;
}
