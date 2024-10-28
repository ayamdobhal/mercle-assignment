import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { optimalRoute } from "./routers/optimal-route";

const app = new Elysia()
    .use(cors())
    .use(
        swagger({
            documentation: {
                info: {
                    title: "Optimal Bridging Route API",
                    version: "1.0.0",
                },
            },
        }),
    )
    .use(optimalRoute)
    .get("/", () => "Hello Elysia")
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
