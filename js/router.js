import { HomePage } from "./pages/private/home.js";
import { UsersPage } from "./pages/private/users.js";
import { LoginPage } from "./pages/public/login.js";
import { state } from "./services/general/state.js";
import { Error404Page } from "./pages/error.404.js";

const routes = {
    "/": LoginPage,
    "/home": HomePage,
    "/users": UsersPage,
    "/login": LoginPage,
};

export async function loadRoute() {
    //Slice corta aprtir de N posicion del string
    const path = location.hash.slice(1) || "/";
    const page = routes[path];
    const app = document.getElementById("app");

    if(!page){
        app.innerHTML = await Error404Page();
        return;
    }

    // if(state.user){
    //     if(path === "/login"){
    //         location.hash = "/home";
    //         return;
    //     }

    // } else {
    //     if(path !== "/login"){
    //         location.hash = "/login";
    //         return;
    //     }
    // }

    app.innerHTML = await page();
}

