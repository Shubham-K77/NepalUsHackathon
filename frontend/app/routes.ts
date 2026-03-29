import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("quiz", "routes/quiz.tsx"),
  route("results", "routes/results.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("call/:assessmentId", "routes/call.tsx"),
] satisfies RouteConfig;
