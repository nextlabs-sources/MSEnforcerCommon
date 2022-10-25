import * as types from '../../actions/types'

const modal = (state = {
    sqlDeploy: false,
    sqlLogin: false,
    sqlDeployConfirm: false,
    fileLogin: false,
    fileDeployConfirm: false,
    userLoad: false,
    userImport: false,
    loginHelpSidebar: false,
}, action) => {
    switch(action.type) {
        case types.CH_SERVER_DEPLOY_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'sqlDeploy': action.payload.visible,
            }
            return nextState
        }        
        case types.CH_DB_LOGIN_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'sqlLogin': action.payload.visible,
            }
            return nextState
        }
        case types.CH_FILE_LOGIN_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'fileLogin': action.payload.visible,
            }
            return nextState
        }
        case types.CH_SQL_DEPLOY_CONFIRM_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'sqlDeployConfirm': action.payload.visible,
            }
            return nextState
        }
        case types.CH_FILE_DEPLOY_CONFIRM_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'fileDeployConfirm': action.payload.visible,
            }
            return nextState
        }
        case types.CH_USER_LOAD_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'userLoad': action.payload.visible,
            }
            return nextState
        }
        case types.CH_USER_IMPORT_MODAL_VISIBLE: {
            const nextState = {
                ...state,
                'userImport': action.payload.visible,
            }
            return nextState
        }
        case types.CH_LOGIN_HELP_SIDEBAR_VISIBLE: {
            const nextState = {
                ...state,
                'loginHelpSidebar': action.payload.visible,
            }
            return nextState
        }
        default: {
            return state
        }
    }
}

export default modal