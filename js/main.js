import { loadRoute } from "./router.js";

window.addEventListener("hashchange", loadRoute);
window.addEventListener("load", loadRoute);