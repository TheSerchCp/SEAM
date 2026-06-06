import { initSelectFields } from '../components/ui/SelectField.js';

export function initializeComponents() {
    // Initialize all select fields
    setTimeout(() => {
        window.initSelectFields?.();
    }, 50);
}
