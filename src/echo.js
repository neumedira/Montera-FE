import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),

  forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",

  enabledTransports: ["ws", "wss"],
});

console.log("REVERB CONFIG:", {
  key: import.meta.env.VITE_REVERB_APP_KEY,
  host: import.meta.env.VITE_REVERB_HOST,
  port: import.meta.env.VITE_REVERB_PORT,
  scheme: import.meta.env.VITE_REVERB_SCHEME,
});

window.echo = echo;

export default echo;