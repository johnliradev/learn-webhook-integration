import { Elysia } from "elysia";
import { r } from "./routes";
import openapi from "@elysiajs/openapi";

const app = new Elysia().use(r).use(openapi()).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
