import { changeDBLoginModalVisibility, addServerCredentials, addDatabases, addDatabasesError, setSQLLoginLoading } from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchDatabases = (server, user, password) => (dispatch, getState) => {
    const { app: { uid }, conn: { servers } } = getState()
    const curServer = servers[server]
    const curProxy = curServer.proxy
    const dbUrl = `/api/databases/${uid}?server=${server}`
    const credentialUrl = `/api/credentials/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    dispatch(setSQLLoginLoading(true))

    AuthFetch(credentialUrl, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({ server, user, password, proxy: curProxy }),
    })
        .then(payload => {
            return AuthFetch(dbUrl, defaultOptions)
        })
        .then((payload) => {
            dispatch(addServerCredentials({ server, user, password }))
            dispatch(addDatabases(payload))
            dispatch(setSQLLoginLoading(false))
            dispatch(dispatch(changeDBLoginModalVisibility(false)))
            return Promise.resolve()
        })
        .catch((error) => {
            console.log(error)
            dispatch(setSQLLoginLoading(false))
            dispatch(addDatabasesError(error.message))
        })
}

export { fetchDatabases }
