import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

import SignInFormCSS from '../SignInForm/SignInForm.css' with { type: 'css'};

export class EditProfileFormLit extends LitElement {
    static styles = [SignInFormCSS];

    static properties = {
        username: { type: String },
        email: { type: String }
    };

    constructor() {
        super();
        this.username = '';
        this.email = '';
    }

    render() {
        return html`
            <form id="edit-profile-form" class="login-form" @submit="${this._onSubmit}">
                <slot></slot>

                <label for="username">Username</label>
                <input type="text" id="username" name="username" .value="${this.username}" />

                <label for="email">Email</label>
                <input type="email" id="email" name="email" .value="${this.email}" />

                <label for="password">Nueva contraseña</label>
                <input type="password" id="password" name="password" placeholder="********" />

                <label for="confirm-password">Confirmar contraseña</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="********" />

                <button type="submit" class="btn">Guardar cambios</button>
            </form>
        `;
    }

    /**
     * Manejador del evento de envío del formulario de edición de perfil.
     * Procesa los campos del formulario y dispara el evento 'edit-profile-submitted' con los datos del formulario.
     * @param {Event} event - El evento de envío del formulario.
     */
    async _onSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(/** @type {HTMLFormElement} */(form));

        const payload = {
            username: formData.get('username')?.toString().trim(),
            email: formData.get('email')?.toString().trim(),
            password: formData.get('password')?.toString(),
            confirmPassword: formData.get('confirm-password')?.toString()
        };

        this.dispatchEvent(new CustomEvent('edit-profile-submitted', {
            detail: payload,
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('edit-profile-form-lit', EditProfileFormLit);

/* En este caso le doy la responsabilidad minima al componente del formulario de editProfile
    asi es mas reutilizable pudiendose usar en otra app sin depender de una conexion a mi API
    ni de el localStorage donde tengo la info del current_user. Quizas en los componentes de
    login y signin haya demasiada reponsabilidad.*/ 