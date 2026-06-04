import { loadRoute } from "./router.js";
import { initDatabase } from "/js/services/indexDB/databaseConnection.js";

await initDatabase();
window.addEventListener("hashchange", loadRoute);
loadRoute();
