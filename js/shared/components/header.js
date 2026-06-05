import { loadCSS } from '../utils/loadCss.js';
import { session }  from '../../state/session.state.js';

export async function Header() {
    await loadCSS("css/components/header.css");
    return `
        <div class="header-content">
            <span class="header-title">SEAM</span>
            ${session.user ? `<span class="header-user">${session.user.full_name ?? session.user.email ?? ''}</span>` : ''}
        </div>
    `;
}
