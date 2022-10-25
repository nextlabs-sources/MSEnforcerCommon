import { combineReducers } from 'redux'
import { isLoggedIn, user } from './login'

export default combineReducers({
    isLoggedIn,
    user,
})
