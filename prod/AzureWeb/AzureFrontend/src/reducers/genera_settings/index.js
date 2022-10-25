import * as types from '../../actions/types'

const generalSetting = (state = {
    jpcHttps: true,
    jpcHost: '',
    jpcPort: '',
    ccHost: '',
    ccPort: '',
    clientId: '',
    clientKey: '',
    policyDecision: 'Deny',
    exceptionMsg: '',
    defaultMsg: '',
    fileInfoServer: '',
    fileInfoPort: '',
}, action) => {
    switch(action.type) {
        case types.ADD_GS: {
            const nextState = {
                jpcHttps: action.payload.jpcHttps,
                jpcHost: action.payload.jpcHost,
                jpcPort: action.payload.jpcPort,
                ccHost: action.payload.ccHost,
                ccPort: action.payload.ccPort,
                clientId: action.payload.clientId,
                clientKey: action.payload.clientKey,
                policyDecision: action.payload.policyDecision,
                exceptionMsg: action.payload.exceptionMsg,
                defaultMsg: action.payload.defaultMsg,
                fileInfoServer: action.payload.fileInfoServer,
                fileInfoPort: action.payload.fileInfoPort,
            }
            return {
                ...state,
                ...nextState,
            }
        }
        case types.CH_FORM_VALUE: {
            const { key, value } = action.payload

            if(key && value !== undefined) {
                return {
                    ...state,
                    [key]: value,
                }
            } else {
                return state
            }
        }
        default: {
            return state
        }
    }
}

export default generalSetting