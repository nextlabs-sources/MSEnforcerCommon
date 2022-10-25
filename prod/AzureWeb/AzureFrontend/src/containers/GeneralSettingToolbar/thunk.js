import { setGSSaveLoading, saveGSError } from '../../actions/creators'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const saveGS = (dispatch, getState) => {
    const { app: { uid, type, }, general_settings } = getState()
    const url = `/api/general_settings/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)
    
    dispatch(setGSSaveLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: type === 'azure_file' ? JSON.stringify(general_settings) : JSON.stringify({
            jpcHttps: general_settings.jpcHttps,
            jpcHost: general_settings.jpcHost,
            jpcPort: general_settings.jpcPort,
            ccHost: general_settings.ccHost,
            ccPort: general_settings.ccPort,
            clientId: general_settings.clientId,
            clientKey: general_settings.clientKey,
            policyDecision: general_settings.policyDecision,
            exceptionMsg: general_settings.exceptionMsg,
            defaultMsg: general_settings.defaultMsg,            
        })
    })
    .then(() => {
        dispatch(setGSSaveLoading(false))
        return Promise.resolve()
    })
    .catch(error => {
        dispatch(setGSSaveLoading(false))
        dispatch(saveGSError(error.message))
    })
}

export { saveGS }