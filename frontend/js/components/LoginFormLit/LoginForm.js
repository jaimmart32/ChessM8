// Si no usamos el Starter Kit:
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
// Si usamos el Starter Kit:
// import { LitElement, html } from 'lit';

// @ts-expect-error TS doesn't like this
import SignInFormCSS from '../SignInForm/SignInForm.css' with { type: 'css'}

import { getAPIData, HttpError } from '../../fetch.js';

export class LoginFormLit extends LitElement {
    static styles = [SignInFormCSS];

    render() {
        return html`
            <form id="login-form" class="login-form" @submit="${this._onFormSubmit}">
                <label for="email">Correo electrónico</label>
                <input type="email" id="email" name="email" placeholder="correo@ejemplo.com" required>

                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="********" required>

                <button type="submit" class="btn">Entrar</button>
            </form>`;
    }

        /**
         * Manejador del evento de envío del formulario de login.
         * Valida los campos del formulario, comprueba si el usuario existe y la contraseña es correcta,
         * establece el usuario actual y redirige a la página de perfil.
         * @param {Event} event - El evento de envío del formulario.
         */
    async _onFormSubmit(event) {
        event.preventDefault();
        console.log('Evento submit del Login detectado con metodo del component LoginFormLit.');

        let form = /**@type {HTMLFormElement}*/(event.target);
        let formData = new FormData(form);

        let email = formData.get('email')?.toString().trim();
        let password = formData.get('password')?.toString();

        if(!email || !password){
            return alert('Debes de completar todos los campos.');
        }

        const credentials = {email, password};

        let formSubmitEvent;

        try {
            const result = await getAPIData('http://127.0.0.1:1337/api/login', 'POST', JSON.stringify(credentials));

            formSubmitEvent = new CustomEvent('login-form-submitted', {
                detail: { success: true, user: result },
                bubbles: true,
                composed: true
            });

        } catch (err) {
            if (err instanceof HttpError && err.response.status === 401) {
                formSubmitEvent = new CustomEvent('login-form-submitted', {
                    detail: { success: false, error: 'Credenciales incorrectas.' },
                    bubbles: true,
                    composed: true
                });
            } else {
                formSubmitEvent = new CustomEvent('login-form-submitted', {
                    detail: { success: false, error: 'Error inesperado, Inténtalo más tarde.'},
                    bubbles: true,
                    composed: true
                });
            }
        }

        this.dispatchEvent(formSubmitEvent);
    }
}

customElements.define('login-form-lit', LoginFormLit);