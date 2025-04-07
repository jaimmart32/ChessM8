
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} avatarUrl
 * @property {string} createdAt
 * @property {{wins: number, losses: number, draws: number}} stats
 */

/**
 * @typedef {Object.<string, any>} State
 * @property {Array<User>} users
 * @property {boolean} isLoading
 * @property {boolean} error
 */

/**
 * Estado inicial del Store
 * @type {State}
 */
export const INITIAL_STATE = {
    users: [],
    isLoading: false,
    error: false
};

// Tipos de acciones disponibles
const ACTION_TYPES = {
   CREATE_USER: 'CREATE_USER',
   READ_USERS: 'READ_USERS',
   UPDATE_USER: 'UPDATE_USER',
   DELETE_USER: 'DELETE_USER'
}

/**
 * Reducer para el estado de usuarios
 * @param {State} state
 * @param {{type: string, user?: User}} action//La propiedad user es opcional,se incluye en C-U-D
 * @returns {State}
 * Redux no permite modificar directamente el estado existente, se copian las claves y valores, se sobreescribe la clave users. El nuevo objeto retornado será el nuevo state.
 */
const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case ACTION_TYPES.CREATE_USER:
            return {
                ...state,
                users: [...state.users, action.user]
            };
        
        case ACTION_TYPES.READ_USERS:
            return { ...state};// No cambia el estado en realidad, pero de momento lo dejo.
        
        case ACTION_TYPES.UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.user?.id ? action.user : user
                )
            };
        
        case ACTION_TYPES.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.user?.id)
            };
        
        default:
            return { ...state};
    }
}
 /**
  * Crea el store personalizado
  * @param {Function} reducer
  * @returns {{ getState: () => State, user: object }}
  */
const createStore = (reducer) => {
    // let currentState = INITIAL_STATE;
    const LOCAL_STORAGE_KEY = 'APP_STATE';
    let currentState = (() => {
        try{
            const appState = localStorage.getItem(LOCAL_STORAGE_KEY);
            return appState ? JSON.parse(appState) : INITIAL_STATE;
        }
        catch (e) {
            console.warn('Error leyendo del localStorage: ', e);
            return INITIAL_STATE;
        }
    })();
    let currentReducer = reducer;

    /**
     * Realiza el dispatch de una accion al reducer actual,
     * modificando el estado actual.
     * @param {Object} action - La accion a realizar
     * @param {function | undefined} [onEventDispatched] - Callback opcional
     * @private
     */
    const _dispatch = (action, onEventDispatched) => {
        const previousValue = currentState;
        const currentValue = currentReducer(currentState, action);
        currentState =  currentValue; 
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
    
        //Emitir evento
        window.dispatchEvent(new CustomEvent('stateChanged', {
            detail: {
                type: action.type,
                changes: _getDifferences(previousValue, currentValue)
            },
            cancelable: true,
            composed: true,
            bubbles: true
        }));

        if(onEventDispatched) onEventDispatched();
    };

    function _getDifferences(prev, curr) {
        return Object.keys(curr).reduce((diff, key) => {
            if(prev[key] === curr[key]) return diff;
            return { ...diff, [key]: curr[key]};
        }, {});
    }

    const createUser = (user, callback) => _dispatch({type: ACTION_TYPES.CREATE_USER, user}, callback);
    const updateUser = (user, callback) => _dispatch({type: ACTION_TYPES.UPDATE_USER, user}, callback);
    const deleteUser = (user, callback) => _dispatch({type: ACTION_TYPES.DELETE_USER, user}, callback);
    const getAllUsers = () => currentState.users;
    const getUserById = (id) => currentState.users.find(user => user.id === id);
    const getUserByUsername = (username) => currentState.users.find(user => user.username === username);
    const getUserByEmail = (email) => currentState.users.find(user => user.email === email);


    return {
        user: {
            create: createUser,
            update: updateUser,
            delete: deleteUser,
            getAll: getAllUsers,
            getById: getUserById,
            getByUsername: getUserByUsername,
            getByEmail: getUserByEmail
        },
        getState: () => currentState
    };
};

export const store = createStore(appReducer);