// @ts-nocheck
import { importTemplate } from "../../lib/importTemplate.js";
// @ts-expect-error TS doesn't like this
import SignInFormCSS from './SignInForm.css' with { type: 'css'}

const TEMPLATE = {
  id: 'signInFormTemplate',
  url: './js/components/SignInForm/SignInForm.html'
}
// se carga el HTML del formulario que está en SignInForm.html, donde se encuentra un <template>.
await importTemplate(TEMPLATE.url);

export class SignInForm extends HTMLElement {

    get template(){
        return document.getElementById(TEMPLATE.id);
    }

    constructor() {
        super();
        console.log('1. instanciando SignInForm (construido HTMLElement)');
    }

    async connectedCallback(){
        console.log('Componente SignInForm añadido al DOM.');

        // Habilita el shadow DOM encapsulado para el componente. Todo lo que se meta en this.shadowRoot será visualmente aislado del resto del DOM.
        this.attachShadow({ mode: "open" });
        console.log('Creado el Shadow root, Shadow DOM activado, ahora se puede añadir el template.');

        this.shadowRoot?.adoptedStyleSheets.push(SignInFormCSS);
        console.log('introducidos estilos en el shadow DOM.');

        this._setUpContent();
    }

    _setUpContent(){
        // Prevenir que se renderice si el template no esta cargado
        if(this.shadowRoot && this.template){
            // Remplazar contenido previo
            this.shadowRoot.innerHTML = '';

            //inserta el fragmento clonado dentro del Shadow DOM del componente.
            //hace que el formulario se vea en pantalla, encapsulado dentro del componente.
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        }
    }
}

//API nativa del navegador para registrar elementos personalizados (Web Components).
customElements.define('signin-form', SignInForm);
