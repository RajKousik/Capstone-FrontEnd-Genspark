import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

const cherryPickedKeys = [
  "REACT_APP_CLOUDINARY_URL",
  "REACT_APP_CLOUDINARY_UPLOAD_PRESET",
];

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), mkcert()],
//   server: { port: 3000, https: true },
// });

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const processEnv = {};
  cherryPickedKeys.forEach((key) => (processEnv[key] = env[key]));

  return {
    define: {
      "process.env": processEnv,
    },
    plugins: [react(), mkcert()],
    server: { port: 3000, https: true },
  };
});
