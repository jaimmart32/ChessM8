import { validateEmail, validatePassword, validateUsername } from "../validate.js";

describe('Validaciones de formulario', () => {
    //Test validateUsername
    describe('validateUsername()', () => {
        test('acepta unsername válido', () => {
            expect(validateUsername('user_123')).toBe(true);
        });

        test('rechaza un username demasiado corto', () => {
            expect(validateUsername('ac')).toBe(false);
        });

        test('rechaza un username con símbolos invalidos', () => {
            expect(validateUsername('Parse!')).toBe(false);
        });

        test('rechaza undefined(errores del form)', () => {
            expect(validateUsername(undefined)).toBe(false);
        });
    });

    //Test validateEmail
    describe('validateEmail()', () => {
        test('acepta un email válido', () => {
            expect(validateEmail('javi@gmail.com')).toBe(true);
        });

        test('rechaza un email sin @', () => {
            expect(validateEmail('xavigmail.com')).toBe(false);
        });

        test('rechaza un email sin caracteres previos a @', () => {
            expect(validateEmail('@gmail.com')).toBe(false);
        });

        test('rechaza un email sin caracteres entre @ y .', () => {
            expect(validateEmail('javi@.com')).toBe(false);
        });

        test('rechaza un email sin caracteres despues de .', () => {
            expect(validateEmail('javi@gmail.')).toBe(false);
        });

        test('rechaza undefined(errores del form)', () => {
            expect(validateEmail(undefined)).toBe(false);
        });
    });

    //Test validatePassword
    describe('validatePassword()', () => {
        test('acepta una contraseña válida', () => {
            expect(validatePassword('secretoDeLaCIA666')).toBe(true);
        });

        test('rechaza una contraseña demasiado corta', () => {
            expect(validatePassword('a13')).toBe(false);
        });

        test('rechaza undefined(errores del form)', () => {
            expect(validatePassword(undefined)).toBe(false);
        });
    });
});