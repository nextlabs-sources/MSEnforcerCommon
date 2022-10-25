import { combineReducers } from 'redux'
import token from './token'
import credentials from './credential'
import users from './users'
import importedUsers from './imported_user'
import skiptoken from './skiptoken'

export default combineReducers({
    token,
    credentials,
    users,
    importedUsers,
    skiptoken,
})
