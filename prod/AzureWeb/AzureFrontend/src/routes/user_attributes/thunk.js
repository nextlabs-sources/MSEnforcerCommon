import * as types from '../../actions/types'
import {
    addUserAttributes,
    addUserAttributesError,
    enforcePartialUserAttributes,
    enforcePartialUserAttributesError,
    changeUserLoadVisibility,
} from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchUserAttributes = (dispatch, getState) => {
    const { app: { uid }, user_attributes: { attributes } } = getState()
    const url = `/api/user_attributes/meta/${uid}`
    const userAttrsFetched = Object.keys(attributes)
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid && userAttrsFetched.length === 0) {
        dispatch({ type: types.ADD_USER_ATTRIBUTES_ASYNC })
        AuthFetch(url, defaultOptions)
            .then((payload) => {
                dispatch(addUserAttributes(payload))
            })
            .catch((error) => {
                dispatch(addUserAttributesError(error.message))
            })
    } else {
        console.log(`fetch user attribtes failed, uid invalid or attributes fetched already`)
    }
}

const fetchEnforcedUserAttributes = (dispatch, getState) => {
    const { app: { uid } } = getState()
    const url = `/api/user_attributes/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid) {
        AuthFetch(url, defaultOptions)
            .then((payload) => {
                const { user_attributes } = payload
                const attrs = user_attributes.map(a => a.name)

                dispatch(enforcePartialUserAttributes(attrs, true))
            })
            .catch((error) => {
                dispatch(enforcePartialUserAttributesError(error.message))
            })
    } else {
        console.log(`fetch user attribtes failed, uid invalid or attributes fetched already`)
    }
}

const checkOAuthCredentials = (dispatch, getState) => {
    const { oauth: { credentials, users } } = getState()
    const { tenantId, appClientId, appClientKey, } = credentials

    if (tenantId && appClientId && appClientKey && users.length > 0) {
        fetchUserAttributes(dispatch, getState)
        fetchEnforcedUserAttributes(dispatch, getState)
    } else {
        dispatch(changeUserLoadVisibility(true))
    }
}

export {
    checkOAuthCredentials,
}
