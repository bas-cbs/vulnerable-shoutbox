import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("profile/:username", "routes/profile.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
