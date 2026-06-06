import { PublicLayout }  from '../../layout/PublicLayout.js';
import { Loader }        from '../../shared/components/Loader.js';
import { login }         from '../../services/auth.service.js';
import { FormValidator } from '../../shared/utils/FormValidator.js';
import { Form }          from '../../shared/components/ui/Form.js';

const primaryButton = 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60';

export async function LoginPage() {
    const loginTemplate = `
        <div id="login-container" class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4 py-10">
            <div id="login-card" class="w-full max-w-md overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/95 shadow-2xl shadow-black/30">
                <div class="border-b border-gray-700 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 px-6 py-8 text-center">
                    <span class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white shadow-lg shadow-black/20">
                        <i class="fa-solid fa-user-shield"></i>
                    </span>
                    <h2 class="text-3xl font-bold text-white">Iniciar sesión</h2>
                    <p class="mt-2 text-sm text-blue-100">Accede al panel administrativo de SEAM</p>
                </div>
                <div class="px-6 py-8">
                    ${Form({
                        id: 'login-form',
                        fields: [
                            { type: 'email', name: 'email', label: 'Correo', placeholder: 'tu@correo.com', required: true },
                            { type: 'password', name: 'password', label: 'Contraseña', placeholder: '••••••••', required: true }
                        ],
                        actions: `
                            <button type="button" class="${primaryButton}" id="btn-login">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                <span>Ingresar</span>
                            </button>`
                    })}
                </div>
            </div>
            <div id="loader-container"></div>
        </div>
    `;

    const events = () => {
        const container = document.getElementById('login-container');
        const loginCard = document.getElementById('login-card');
        const registerCard = document.getElementById('register-card');
        const btnLogin = document.getElementById('btn-login');
        const btnToRegister = document.getElementById('btn-to-register');

        if (!btnLogin) { setTimeout(events, 0); return; }

        const loginValidator = new FormValidator('login-form', {
            email: { required: true, email: true },
            password: { required: true, password: true }
        }, { buttonId: 'btn-login' });

        const registerValidator = new FormValidator('register-form', {
            email: { required: true, email: true },
            password: { required: true, password: true },
            confirmPassword: { required: true, password: true, match: 'password' }
        });

        registerCard?.remove();
        loginValidator.attach();

        btnToRegister?.addEventListener('click', () => {
            if (!registerCard) return;
            loginCard.remove();
            container.appendChild(registerCard);
            registerValidator.attach();
        });

        btnLogin.addEventListener('click', async () => {
            if (!loginValidator.validate()) return;

            Loader.show('Validando credenciales...');

            const { email, password } = Object.fromEntries(new FormData(document.getElementById('login-form')));

            setTimeout(() => {
                login(email.trim(), password.trim()).then(currentSession => {
                    Loader.hide();
                    if (currentSession) {
                        location.hash = '/home';
                    } else {
                        console.warn('Credenciales inválidas');
                    }
                });
            }, 1000);
        });

        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-register') {
                if (!registerValidator.validate()) return;
                console.log('Registrar usuario');
            }

            if (e.target.id === 'btn-back') {
                document.getElementById('register-form')?.reset();
                registerValidator.clearErrors();
                registerCard?.remove();
                container.appendChild(loginCard);
                loginValidator.attach();
            }
        });
    };

    setTimeout(events, 0);
    return PublicLayout(loginTemplate);
}
