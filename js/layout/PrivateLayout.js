import { Sidebar } from '../shared/components/sidebar.js';
import { Header }  from '../shared/components/header.js';
import { Footer }  from '../shared/components/footer.js';

export async function PrivateLayout(content) {
    return `
        <div class="layout">
            <header class="header">
                ${await Header()}
            </header>

            <div class="main-container">
                <aside class="sidebar">${await Sidebar()}</aside>
                <main class="content">${content}</main>
            </div>
            
            <footer class="footer">
                ${await Footer()}
            </footer>
        </div>
    `;
}