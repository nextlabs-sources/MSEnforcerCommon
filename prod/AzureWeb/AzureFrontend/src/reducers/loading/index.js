import * as types from '../../actions/types'

const loading = (state = {
    login: false,
    sqlLogin: false,
    sqlDeploy: false,
    fileLogin: false,
    seSave: false,
    uaSave: false,
    gsSave: false,
    userImport: false,
    userExpand: false,
    signup: false,
}, action) => {
    switch(action.type) {
        case types.CH_LOGIN_LOADING: {
            return {
                ...state,
                login: !!action.payload.loading
            }
        }
        case types.CH_SQL_DEPLOY_LOADING: {
            return {
                ...state,
                sqlDeploy: !!action.payload.loading
            }
        }        
        case types.CH_SQL_LOGIN_LOADING: {
            return {
                ...state,
                sqlLogin: !!action.payload.loading
            }
        }
        case types.CH_FILE_LOGIN_LOADING: {
            return {
                ...state,
                fileLogin: !!action.payload.loading
            }
        }
        case types.CH_SE_SAVE_LOADING: {
            return {
                ...state,
                seSave: !!action.payload.loading
            }
        }
        case types.CH_UA_SAVE_LOADING: {
            return {
                ...state,
                uaSave: !!action.payload.loading
            }
        }
        case types.CH_GS_SAVE_LOADING: {
            return {
                ...state,
                gsSave: !!action.payload.loading
            }
        }
        case types.CH_USER_IMPORT_LOADING: {
            return {
                ...state,
                userImport: !!action.payload.loading
            }
        }
        case types.CH_SIGNUP_LOADING: {
            return {
                ...state,
                signup: !!action.payload.loading
            }
        }
        case types.CH_USER_EXPAND_LOADING: {
            return {
                ...state,
                userExpand: !!action.payload.loading,
            }
        }       
        default: {
            return state
        }
    }
}

export default loading