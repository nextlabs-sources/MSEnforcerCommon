import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import oauth from './oauth'
import app from './app'
import conn from './conn'
import misc from './misc'
import fileServers from './file_server'
import modal from './modal'
import user_attributes from './user_attributes'
import general_settings from './genera_settings'
import loading from './loading'
import errors from './error'
import pagination from './pagination'

export default combineReducers({
    auth,
    oauth,
    app,
    conn,
    misc,
    fileServers,
    modal,
    user_attributes,
    general_settings,
    loading,
    errors,
    router: routerReducer,
    pagination,
})
