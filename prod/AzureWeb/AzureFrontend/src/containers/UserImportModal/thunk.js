import { 
    setUserImportLoading, 
    changeUserImportVisibility, 
    importADUsersError, 
    addADUsers, 
    addADUsersError, 
    addSkipToken, 
    setUserExpandLoading,
} from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import config from '../../config'
import Utils from '../../utils'

const { Aux } = Utils
const importUsers = (dispatch, getState) => {
    const { app: { uid }, oauth: { users, importedUsers }, misc: { current_server } } = getState()
    const importedUserKeys = Object.keys(importedUsers).filter(k => importedUsers[k])
    const usersToImport = users.filter(u => importedUserKeys.indexOf(u.objectId) >= 0)
    const url = `/api/ad_users/${uid}?server=${current_server}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    dispatch(setUserImportLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(usersToImport)
    })
    .then(() => {
        dispatch(setUserImportLoading(false))
        dispatch(changeUserImportVisibility(false))
    })
    .catch(err => {
        dispatch(importADUsersError(err.message))
        dispatch(setUserImportLoading(false))
    })
}

const fetchADUsers = (dispatch, getState) => {
    const { oauth: { skiptoken, credentials: { tenantId }, token: { token_type, access_token } } } = getState()
    const url = `${config.Resource.users}/${tenantId}/users?api-version=1.6&$skiptoken=${skiptoken}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)    

    dispatch(setUserExpandLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        mode: 'cors',
        credentials: 'omit',
        headers: {
            ...defaultOptions.headers,
            Authorization: `${token_type} ${access_token}`
        }
    })
    .then(payload => {
        const { value } = payload
        const nextPageLink = payload['odata.nextLink'] || ''
        const nextPageQueryString = nextPageLink.split('?')[1] || ''
        const nextPageSkiptoken = nextPageQueryString.split('=')[1] || ''

        dispatch(setUserExpandLoading(false))
        dispatch(addADUsers(value))
        dispatch(addSkipToken(nextPageSkiptoken))
    })
    .catch(err => {
        dispatch(setUserExpandLoading(false))
        dispatch(addADUsersError(err.message))
    })
}

export {
    importUsers,
    fetchADUsers,
}