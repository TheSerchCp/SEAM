import { PrivateLayout } from "../../layout/private.layout.js";

export async function HomePage() {
    return PrivateLayout(`
        <div>
            <h1>Inicio</h1>
            <p>
            Bienvenido
            </p>
        </div>
    `);
}