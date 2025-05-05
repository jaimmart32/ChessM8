// Si no usamos el Starter Kit:
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
// Si usamos el Starter Kit:
// import { LitElement, html } from 'lit';

// @ts-expect-error TS doesn't like this
import SignInFormCSS from '../SignInForm/SignInForm.css' with { type: 'css'}

import { User } from '../../classes/User.js';
import { getAPIData, HttpError } from '../../fetch.js';
import { validateUsername, validateEmail, validatePassword } from '../../validate.js';


export class SignInFormLit extends LitElement {
    static styles = [SignInFormCSS];

    render() {
        return html`
            <form id="register-form" class="login-form" @submit="${this._onFormSubmit}">

                <slot></slot>

                <label for="username">Nombre de usuario</label>
                <input type="text" id="username" name="username" placeholder="pepito22" required />

                <label for="email">Correo electrónico</label>
                <input type="email" id="email" name="email" placeholder="correo@ejemplo.com" required />

                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="********" required />

                <button type="submit" class="btn">Registrarse</button>
            </form>`;
    }

        /**
         * Manejador del evento de envío del formulario de registro.
         * Valida los campos del formulario, crea un nuevo usuario y lo registra en la API.
         * Si hay un error en el registro, muestra un mensaje de error.
         * Si el registro es exitoso, muestra un mensaje de confirmación y redirige a la página de login.
         * @param {Event} event - El evento de envío del formulario.
         */
    async _onFormSubmit(event) {
        event.preventDefault();
        console.log('Evento Submit registrado con Lit @submit="metodo del component"');


        const form = /**@type {HTMLFormElement}*/(event.target);
        const formData = new FormData(form);

        const username = formData.get('username')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString();

        const validations = [
            {valid: !!username, message: 'Nombre de usuario no proporcionado'},
            {valid: !!email, message:'Email no proporcionado'},
            {valid: !!password, message: 'Password no proporcionada'},
            {valid: validateUsername(username), message: 'Nombre de usuario inválido'},
            {valid: validateEmail(email), message: 'Email inválido'},
            {valid: validatePassword(password), message: 'Password inválida'},
        ]

        for(const check of validations){
            if(!check.valid){
                alert(check.message);
                return;
            }
        }

        const newUser = new User(/**@type {string}*/(username), /**@type {string}*/(email), /**@type {string}*/(password));

        let formSubmitEvent;

        try {
            await getAPIData(
                'http://127.0.0.1:1337/api/register',
                'POST',
                JSON.stringify(newUser)
            );

            formSubmitEvent = new CustomEvent('signin-form-submitted', {
                detail: { success: true, user: newUser },
                bubbles: true,
                composed: true
            });
            // alert('Registro exitoso, puedes iniciar sesión!');
            // window.location.href = 'login.html';
        } catch (err) {
            if (err instanceof HttpError && err.response.status === 409) {
                formSubmitEvent = new CustomEvent('signin-form-submitted', {
                    detail: { success: false, error: 'Email o username ocupados.'},
                    bubbles: true,
                    composed: true
                });
                // alert('El email o el username ya están registrados.');
            } else {
                formSubmitEvent = new CustomEvent('signin-form-submitted', {
                    detail: { success: false, error: 'Error al registrarse, intentalo más tarde.'},
                    bubbles: true,
                    composed: true
                });
                // console.error('Error inesperado', err);
                // alert('Error al registrarse, intentalo más tarde.');
            }
        }

        this.dispatchEvent(formSubmitEvent);
    }
}

customElements.define('signin-form-lit', SignInFormLit);