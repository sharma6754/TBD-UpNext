import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/todo-app/", // Replace 'todo-app' with your repo name
  plugins: [react()],
});
