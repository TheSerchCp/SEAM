import { session } from '../state/session.state.js';

export const getSidebarItems = () => {
    const items = session.sidebarItems ?? [];
    return items.map(item => ({ name: item.nameItem, link: item.route }));
};
