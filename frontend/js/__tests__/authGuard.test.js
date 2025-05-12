/** 
 * @jest-environment jsdom 
 */

/* eslint-disable no-undef */
import { jest } from '@jest/globals';

//Paréntesis alrededor de {}	Para devolver un objeto literal desde una arrow function
//jest.unstable_mockModule	Única forma de hacer mock en módulos ES (type: "module")
const mockGetCurrentUser = jest.fn();
jest.unstable_mockModule('../db.js', () => ({
    getCurrentUser: mockGetCurrentUser
}));

//await import()	Para que Jest aplique correctamente el mock antes de cargar el módulo
const { getCurrentUser } = await import('../db.js');
const { isAuthenticated, requireAuth } = await import('../authGuard.js');

describe('authGuard', () => {
    
    const fakeUser = {id: '1', username: 'javi', email: 'javi@gmail.com', 
        password: 'qwerty', avatarUrl: 'road/to/heaven/', createdAt: '25/12/2000', 
        stats: {wins: 0, losses: 0, draws: 0}};
    describe('isAuthenticated()', () => {
        test('devuelve true si hay usuario', () => {
            mockGetCurrentUser.mockReturnValue(fakeUser);
            expect(isAuthenticated()).toBe(true);
        });

        test('devuelve false si no hay usuario', () => {
            mockGetCurrentUser.mockReturnValue(null);
            expect(isAuthenticated()).toBe(false);
        });
    });

    describe('requireAuth()', () => {
        let alertMock;

        beforeEach(() => {
            alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {
                /*evita que se muestre una ventana real de alerta */});
            Object.defineProperty(window, 'location', {
                writable: true,
                value: {href: ''}
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('redirige a login si ho hay usuario logueado', () => {
            mockGetCurrentUser.mockReturnValue(null);
            requireAuth();

            expect(alertMock).toHaveBeenCalledWith('Debes de iniciar sesion para acceder aqui.');
            expect(window.location.href).toBe('login.html');
        });

        test('no hace nada si hay usuario en logueado en localStorage', () => {
            mockGetCurrentUser.mockReturnValue(fakeUser);
            requireAuth();

            expect(alertMock).not.toHaveBeenCalled();
            expect(window.location.href).toBe('');
        });
    });
});