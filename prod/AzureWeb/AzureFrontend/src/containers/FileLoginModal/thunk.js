import { 
    changeFileLoginModalVisibility, 
    addFileServer, 
    addFileServerError, 
    setFileLoginLoading,
    changeFileDeployConfirmVisibility,
    addLatestFileServer,
} from '../../actions/creators'
import * as types from '../../actions/types'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchProxy = (server, account, key) => (dispatch, getState) => {
    const { app: { uid, type } } = getState()
    const url = `/api/proxy/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)
    
    dispatch(setFileLoginLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({
            server,
            type,
            account,
            key,
        })
    })
    .then(info => {
        dispatch(setFileLoginLoading(false))
        dispatch(addFileServer({ name: server, proxy: info.proxy, account, key }))
        dispatch(addLatestFileServer(server))
        dispatch(changeFileLoginModalVisibility(false))
        dispatch(changeFileDeployConfirmVisibility(true))
        dispatch({ type: types.PERSIST_STATE })
        
        return Promise.resolve()
    })
    .catch(error => {
        dispatch(setFileLoginLoading(false))
        dispatch(addFileServerError(error.message))
    })
}

export { fetchProxy }
