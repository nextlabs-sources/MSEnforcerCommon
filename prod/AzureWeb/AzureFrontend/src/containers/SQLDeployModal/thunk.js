import {
    addServerInfo,
    addServerInfoError,
    changeServerDeployModalVisibility,
    changeSQLDeployConfirmVisibility,
    setSQLDeployLoading,
    addLatestSQLServer,
} from '../../actions/creators'
import * as types from '../../actions/types'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchProxy = server => (dispatch, getState) => {
    const { app: { uid, type } } = getState()
    const url = `/api/proxy/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    dispatch(setSQLDeployLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({
            server,
            type,
        })
    })
        .then(proxy => {
            dispatch(setSQLDeployLoading(false))
            dispatch(addServerInfo(proxy))
            dispatch(addLatestSQLServer(server))
            dispatch(changeServerDeployModalVisibility(false))
            dispatch(changeSQLDeployConfirmVisibility(true))
            dispatch({ type: types.PERSIST_STATE })
            return Promise.resolve()
        })
        .catch(error => {
            dispatch(setSQLDeployLoading(false))
            dispatch(addServerInfoError(error.message))
        })
}

export {
    fetchProxy,
}