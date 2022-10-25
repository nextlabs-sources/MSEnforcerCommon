import { 
    addColumns, 
    addColumnsError,
    addTables, 
    addTablesError, 
    setCurTablePage, 
    setTableLoadDone, 
    setTableLoadLoading,    
} from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchTables = (dispatch, getState) => {
    const { app: { uid }, misc: { current_server, current_database }, pagination } = getState()
    const curPager = pagination[`${current_server}/${current_database}`] || { page: 1, done: true, loading: false }
    const { page } = curPager
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)
        
    dispatch(setTableLoadLoading(current_server, current_database, true))
    AuthFetch(`/api/tables/meta/${uid}?server=${current_server}&database=${current_database}&page=${page}`, defaultOptions)
    .then((payload) => {
        dispatch(addTables(payload))
        dispatch(setCurTablePage(current_server, current_database, page + 1))
        dispatch(setTableLoadDone(current_server, current_database, !!payload.done))
        dispatch(setTableLoadLoading(current_server, current_database, false))
    })
    .catch((error) => {
        dispatch(addTablesError(error.message))
        dispatch(setTableLoadLoading(current_server, current_database, false))
    })        
}
const fetchColumns = (server, database, table) => (dispatch, getState) => {
    const { app: { uid }, conn: { columns } } = getState()
    const url = `/api/columns/meta/${uid}?server=${server}&database=${database}&table=${table}`
    const colsFetched = Object.keys(columns).filter(ck => (
        columns[ck] && columns[ck].server === server &&
        columns[ck].database === database && columns[ck].table === table
    ))
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid && server && database && table && colsFetched.length === 0) {
        AuthFetch(url, defaultOptions)
            .then((payload) => {
                dispatch(addColumns(payload))
            })
            .catch((error) => {
                dispatch(addColumnsError(error))
            })
    } else {
        console.log(`columns fetched or params invalid`, uid, server, database, table)
    }
}

export { fetchColumns, fetchTables, }
