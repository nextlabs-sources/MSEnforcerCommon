import {
    addTables,
    addTablesError,
    enforceTables,
    enforceTablesError,
    changeDBLoginModalVisibility,
    setCurTablePage,
    setTableLoadDone,
    addUnloadTables,
} from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const checkServerCredentials = (dispatch, getState) => {
    const { misc: { current_server }, conn: { credentials } } = getState()
    const { user, password } = credentials[current_server] || {}

    if (!user || !password) {
        dispatch(changeDBLoginModalVisibility(true))
    }
}

const fetchTables = (dispatch, getState) => {
    const { app: { uid }, conn: { tables }, misc: { current_server, current_database }, pagination } = getState()
    const curPager = pagination[`${current_server}/${current_database}`] || { page: 1, loading: false, done: true }
    const tablesOfCurDB = Object.keys(tables).filter(tk => (tables[tk] && tables[tk].server === current_server && tables[tk].database === current_database))
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid && current_server && current_database && tablesOfCurDB.length === 0) {
        AuthFetch(`/api/tables/meta/${uid}?server=${current_server}&database=${current_database}&page=${curPager.page}`, defaultOptions)
            .then((payload) => {
                dispatch(addTables(payload))
                dispatch(setCurTablePage(current_server, current_database, curPager.page + 1))
                dispatch(setTableLoadDone(current_server, current_database, !!payload.done))
            })
            .catch((error) => {
                dispatch(addTablesError(error.message))
                dispatch(setTableLoadDone(current_server, current_database, true))                
            })
    }
}

const fetchEnforcedTables = (server, database) => (dispatch, getState) => {
    const { app: { uid } } = getState()
    const url = `/api/tables/${uid}?server=${server}&database=${database}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    AuthFetch(url, defaultOptions)
        .then(payload => {
            const { server, database, tables } = payload
            dispatch(addUnloadTables(payload))
            dispatch(enforceTables(tables, { server, database, enforcement: { enforced: true, willbeEnforced: true } }))
        })
        .catch(error => {
            dispatch(enforceTablesError(error.message))
        })
}

export {
    checkServerCredentials,
    fetchTables,
    fetchEnforcedTables,
}
