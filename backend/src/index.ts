import { Elysia } from "elysia";
import { r } from "./routes";
import openapi from "@elysiajs/openapi";
import cors from "@elysiajs/cors";

const app = new Elysia().use(r).use(cors()).use(openapi()).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
