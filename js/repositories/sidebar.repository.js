import { session } from '../state/session.state.js';

export const getByRoleId = (_roleId) => {
    const items = session.sidebarItems ?? [];
    return items.map(i => ({ name: i.nameItem, link: i.route }));
};
