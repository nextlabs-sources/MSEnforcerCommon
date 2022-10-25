import {
    saveUserAttributesError, 
    setUASaveLoading,
    changeUserImportVisibility,
} from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const saveAttributes = (dispatch, getState) => {
    const { app: { uid }, user_attributes: { attributes, enforcer } } = getState()
    const attrsEnforced = Object.keys(enforcer).filter(ak => enforcer[ak].willbeEnforced).map(ak => attributes[ak])
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid) {
        const url = `/api/user_attributes/${uid}`

        dispatch(setUASaveLoading(true))
        AuthFetch(url, {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify(attrsEnforced),
        })
            .then(() => {
                dispatch(setUASaveLoading(false))                    
                return Promise.resolve()
            })
            .catch((err) => {
                dispatch(setUASaveLoading(false))
                dispatch(saveUserAttributesError(err.message))
            })
    }
}

const importUsers = (dispatch, getState) => {
    dispatch(changeUserImportVisibility(true))
}

export {
    saveAttributes,
    importUsers,
}
