import { Elysia } from "elysia";
import { optimalRoute } from "./routers/optimal-route";

const app = new Elysia()
    .use(optimalRoute)
    .get("/", () => "Hello Elysia")
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
