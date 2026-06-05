import * as AuthRepo from '../repositories/auth.repository.js';
import { session }   from '../state/session.state.js';
import { EventBus }  from '../core/EventBus.js';

export const login = async (email, password) => {
    const data = await AuthRepo.login(email, password);
    if (!data) return null;

    session.user         = data.user;
    session.token        = data.token;
    session.permissions  = new Set(data.permissions ?? []);
    session.sidebarItems = data.sidebarItems ?? [];

    localStorage.setItem('currentUser', JSON.stringify({
        user:         data.user,
        token:        data.token,
        permissions:  data.permissions  ?? [],
        sidebarItems: data.sidebarItems ?? [],
    }));

    // Conectar socket con el JWT para recibir eventos de progreso
    EventBus.connect(data.token);

    return data;
};

export const logout = () => {
    EventBus.disconnect();
    localStorage.removeItem('currentUser');
    session.user = session.token = session.permissions = session.sidebarItems = null;
};
