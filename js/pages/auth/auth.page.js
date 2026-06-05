import { loadCSS }       from '../../shared/utils/loadCss.js';
import { PublicLayout }  from '../../layout/PublicLayout.js';
import { Loader }        from '../../shared/components/Loader.js';
import { login }         from '../../services/auth.service.js';
import { FormValidator } from '../../shared/utils/FormValidator.js';
import { Form }          from '../../shared/components/ui/Form.js';

export async function LoginPage() {
   await loadCSS('css/pages/public/login/login.css');
  //<button type="button" class="btn-link"  id="btn-to-register">¿No tienes cuenta? Regístrate</button>
  /*
              <div class="card" id="register-card">
                <div class="card-header"><h2>Registro</h2></div>
                <div class="card-body">
                    ${Form({
                        id: 'register-form',
                        fields: [
                            { type: 'email',    name: 'email',           label: 'Correo',               required: true },
                            { type: 'password', name: 'password',        label: 'Contraseña',           required: true },
                            { type: 'password', name: 'confirmPassword', label: 'Confirmar Contraseña', required: true }
                        ],
                        actions: `
                            <button type="button" class="btn-info" id="btn-register">Registrarse</button>
                            <button type="button" class="btn-link" id="btn-back">¿Ya tienes cuenta? Inicia sesión</button>
                        `
                    })}
                </div>
            </div>
  
  */
   const loginTemplate = `
        <div class="login-container" id="login-container">

            <div class="card" id="login-card">
                <div class="card-header"><h2>Login</h2></div>
                <div class="card-body">
                    ${Form({
                        id: 'login-form',
                        fields: [
                            { type: 'email',    name: 'email',    label: 'Correo',     required: true },
                            { type: 'password', name: 'password', label: 'Contraseña', required: true }
                        ],
                        actions: `
                            <button type="button" class="btn-info"  id="btn-login">Ingresar</button>
                        `
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
