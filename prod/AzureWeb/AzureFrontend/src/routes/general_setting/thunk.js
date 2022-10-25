import { addGS, addGSError, } from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchGeneralSettings = (dispatch, getState) => {
    const { app: { uid } } = getState()
    const url = `/api/general_settings/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    AuthFetch(url, defaultOptions)
        .then(setting => {
            dispatch(addGS(setting))
        })
        .catch(error => {
            dispatch(addGSError(error.message))
        })
}

export {
    fetchGeneralSettings,
}