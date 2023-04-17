import { combineReducers, legacy_createStore as createStore } from 'redux'
import { toyReducer } from './toy.reducer'
import { userReducer } from './user.reducer.js'


const rootReducer = combineReducers({
    toyModule: toyReducer,
    userModule: userReducer,
})

const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)