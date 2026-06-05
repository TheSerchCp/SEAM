import { session } from '../state/session.state.js';

export const generateReport = (type) => {
    const report = { id: Date.now(), type, fecha: new Date().toLocaleDateString() };
    session.reportes = [...(session.reportes ?? []), report];
    return report;
};
