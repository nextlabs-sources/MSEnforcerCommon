import { push } from 'react-router-redux'
import { compile } from 'path-to-regexp'
import { addToken, addTokenError, addADUsers, addADUsersError, addSkipToken, } from '../../actions/creators'
import config from '../../config'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchADUsers = (dispatch, getState) => {
    const { app: { uid, type, }, oauth: { credentials: { tenantId }, token: { token_type, access_token } } } = getState()
    const url = `${config.Resource.users}/${tenantId}/users?api-version=1.6`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

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

            dispatch(addADUsers(value))
            dispatch(addSkipToken(nextPageSkiptoken))
            dispatch(push(compile(config.Routes.user_attributes)({ uid, type })))
        })
        .catch(err => {
            dispatch(addADUsersError(err.message))
        })
}

const fetchToken = (code) => (dispatch, getState) => {
    const url = '/api/token/grant'
    const { oauth: { credentials } } = getState()
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({
            client_id: credentials.appClientId,
            client_secret: credentials.appClientKey,
            tenantId: credentials.tenantId,
            code,
            redirect_uri: config.App.callback,
        })
    })
        .then(token => {
            dispatch(addToken(token))
        })
        .then(() => {
            fetchADUsers(dispatch, getState)
            return Promise.resolve()
        })
        .catch(error => {
            dispatch(addTokenError(error.message))
        })
}

export {
    fetchToken,
}
