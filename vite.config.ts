import vercel from "vite-plugin-vercel";
import {telefunc} from "telefunc/vite";
import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import HonoDevServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [react({}), ssr({
    prerender: true,
  }), telefunc(), vercel(), HonoDevServer({
    entry: 'server/index.ts', // The file path of your application.
  })],
});