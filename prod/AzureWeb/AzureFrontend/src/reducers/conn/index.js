import { combineReducers } from 'redux'
import servers from './server'
import credentials from './credential'
import databases from './db'
import columns from './col'
import tables from './table'
import enforcer from './enforcer'

export default combineReducers({
    servers,
    credentials,
    databases,
    columns,
    tables,
    enforcer,
})
