import * as types from './types'
import Util from '../utils'

// #region - modal
export const changeServerDeployModalVisibility = visible => ({
    type: types.CH_SERVER_DEPLOY_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeDBLoginModalVisibility = visible => ({
    type: types.CH_DB_LOGIN_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeFileLoginModalVisibility = visible => ({
    type: types.CH_FILE_LOGIN_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeSQLDeployConfirmVisibility = visible => ({
    type: types.CH_SQL_DEPLOY_CONFIRM_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeFileDeployConfirmVisibility = visible => ({
    type: types.CH_FILE_DEPLOY_CONFIRM_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeUserLoadVisibility = visible => ({
    type: types.CH_USER_LOAD_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeUserImportVisibility = visible => ({
    type: types.CH_USER_IMPORT_MODAL_VISIBLE,
    payload: {
        visible,
    },
})

export const changeLoginHelpSidebarVisibility = visible => ({
    type: types.CH_LOGIN_HELP_SIDEBAR_VISIBLE,
    payload: {
        visible,
    },
})
// #endregion

// #region - oauth
export const addToken = (token) => ({
    type: types.ADD_TOKEN,
    payload: {
        token
    },
})

export const addTokenError = error => ({
    type: types.ADD_TOKEN_ERROR,
    error,
})

export const refreshToken = (resource, token) => ({
    type: types.REFRESH_TOKEN,
    payload: {
        resource,
        token,
    },
})

export const refreshTokenError = error => ({
    type: types.REFRESH_TOKEN_ERROR,
    error,
})

export const addOAuthCredentials = credentials => {
    return {
        type: types.ADD_OAUTH_CREDENTIALS,
        payload: credentials,
    }
}

export const addADUsers = users => {
    return {
        type: types.ADD_AD_USERS,
        payload: {
            users
        }
    }
}

export const addADUsersError = error => {
    return {
        type: types.ADD_AD_USERS_ERROR,
        error,
    }
}

export const checkADUser = (objectId, checked) => {
    return {
        type: types.CHECK_AD_USER,
        payload: {
            objectId,
            checked,
        }
    }
}

export const checkAllADUsers = (uids, checked) => {
    return {
        type: types.CHECK_ALL_AD_USERS,
        payload: {
            uids,
            checked,
        }
    }
}

export const importADUsersError = error => {
    return {
        type: types.IMPORT_AD_USERS_ERROR,
        error,
    }
}

export const addSkipToken = skiptoken => {
    return {
        type: types.ADD_SKIPTOKEN,
        payload: { skiptoken },
    }
}
// #endregion

// #region - login
export const changeLoginState = isLoggedIn => ({
    type: types.CH_LOGIN_STATE,
    payload: {
        isLoggedIn,
    },
})

export const changeLoginStateError = error => ({
    type: types.CH_LOGIN_STATE_ERROR,
    error,
})

export const addUserInfo = userInfo => ({
    type: types.ADD_USER_INFO,
    payload: userInfo,
})

export const addClientID = uid => ({
    type: types.ADD_CLIENT_ID,
    payload: { uid },
})

export const addClientType = type => ({
    type: types.ADD_CLIENT_TYPE,
    payload: { type },
})
// #endregion

// #region - user
export const addUserAttributes = attrs => ({
    type: types.ADD_USER_ATTRIBUTES,
    payload: {
        attributes: attrs,
    },
})

export const addUserAttributesError = error => ({
    type: types.ADD_USER_ATTRIBUTES_ERROR,
    error,
})

export const saveUserAttributesError = error => ({
    type: types.SAVE_USER_ATTRIBUTES_ERROR,
    error,
})

export const addCurrentUserAsync = () => ({
    type: types.ADD_CURRENT_USER,
})

export const addCurrentUser = user => ({
    type: types.ADD_CURRENT_USER,
    payload: {
        user,
    },
})

export const addCurrentUserError = error => ({
    type: types.ADD_CURRENT_USER_ERROR,
    error,
})
// #endregion

// #region - tables
/**
 *
 * @param {{ server: string, user: string, password: string }} credentials
 */
export const addServerCredentials = credentials => ({
    type: types.ADD_SERVER_CREDENTIALS,
    payload: credentials,
})

export const addServerInfo = info => {
    return {
        type: types.ADD_SERVER_INFO,
        payload: info,
    }
}

export const addServerInfoError = error => {
    return {
        type: types.ADD_SERVER_INFO_ERROR,
        error,
    }
}

export const addServerInfos = infos => {
    return {
        type: types.ADD_SERVER_INFOS,
        payload: infos,
    }
}

export const addServerInfosError = error => {
    return {
        type: types.ADD_SERVER_INFOS_ERROR,
        error,
    }
}

export const addDatabases = databases => ({
    type: types.ADD_DBS,
    payload: databases,
})

export const addDatabasesError = error => ({
    type: types.ADD_DBS_ERROR,
    error,
})

export const addTables = tables => ({
    type: types.ADD_TABLES,
    payload: tables,
})

export const addTablesError = error => ({
    type: types.ADD_TABLES_ERROR,
    error,
})

export const saveTablesError = error => {
    return {
        type: types.SAVE_TABLES_ERROR,
        error,
    }
}

export const exportTablesError = error => {
    return {
        type: types.EXPORT_TABLES_ERROR,
        error,
    }
}

export const addUnloadTables = payload => ({
    type: types.ADD_UNLOAD_TABLES,
    payload,
})
// #endregion

// #region - columns
export const addColumns = columns => ({
    type: types.ADD_COLUMNS,
    payload: columns,
})

export const addColumnsError = error => ({
    type: types.ADD_COLUMNS_ERROR,
    error,
})
// #endregion

// #region - enforcement
/**
 *
 * @param {{ name: string, database: string, server: string, enforcement: { enforced: boolean, willbeEnforced: boolean } }} info
 */
export const enforceTable = info => ({
    type: types.ENFORCE_TABLE,
    payload: info,
})

/**
 * 
 * @param {{ name: string, type: string, schema: string }[]} tables 
 * @param {database: string, server: string, enforcement: { enforced: boolean, willbeEnforced: boolean }} info 
 */
export const enforceTables = (tables, info) => {
    return {
        type: types.ENFORCE_TABLES,
        payload: {
            server: info.server,
            database: info.database,
            tables,
            enforcement: info.enforcement,
        }
    }
}

export const enforceTablesError = error => {
    return {
        type: types.ENFORCE_TABLES_ERROR,
        error,
    }
}
/**
 *
 * @param {{ name: string, table: string, database: string, server: string, enforcement: { enforced: boolean, willbeEnforced: boolean } }} info
 */
export const enforceAttribute = info => ({
    type: types.ENFORCE_ATTRIBUTE,
    payload: info,
})

export const enforceAllAttributes = (attrs, info) => ({
    type: types.ENFORCE_ALL_ATTRIBUTES,
    payload: {
        server: info.server,
        database: info.database,
        table: info.table,
        attrs,
        enforcement: info.enforcement,
    },
})

/**
 *
 * @param {string} attr - attribute name
 * @param {boolean} enforced
 */
export const enforceUserAttribute = (attr, enforced) => ({
    type: types.ENFORCE_USER_ATTRIBUTE,
    payload: {
        name: attr,
        enforcement: {
            enforced,
            willbeEnforced: enforced,
        },
    },
})

export const enforcePartialUserAttributes = (attrs, enforced) => ({
    type: types.ENFORCE_PARTIAL_USER_ATTRIBUTES,
    payload: {
        attrs,
        enforcement: {
            enforced,
            willbeEnforced: enforced,
        },
    },
})

export const enforcePartialUserAttributesError = error => ({
    type: types.ENFORCE_PARTIAL_USER_ATTRIBUTES_ERROR,
    error,
})

/**
 *
 * @param {string[]} attrs - attribute names
 * @param {boolean} enforced
 */
export const enforceAllUserAttributes = (attrs, enforced) => ({
    type: types.ENFORCE_ALL_USER_ATTRIBUTES,
    payload: {
        attrs,
        enforcement: {
            enforced,
            willbeEnforced: enforced,
        },
    },
})
// #endregion

// #region - misc
export const setCurrentServer = server => {
    return {
        type: types.SET_CUR_SERVER,
        payload: { server },
    }
}

export const setCurrentDB = database => ({
    type: types.SET_CUR_DB,
    payload: { database },
})

export const setCurrentFile = file => ({
    type: types.SET_CUR_FILE,
    payload: {
        file,
    }
})

export const addLatestSQLServer = server => ({
    type: types.ADD_LATEST_SQL_SERVER,
    payload: {
        server,
    }
})

export const addLatestFileServer = server => ({
    type: types.ADD_LATEST_FILE_SERVER,
    payload: {
        server,
    }
})

export const setCurTablePage = (server, database, page) => ({
    type: types.SET_CUR_TABLE_PAGE,
    payload: {
        server,
        database,
        page,
    }
})

export const setTableLoadDone = (server, database, done) => ({
    type: types.SET_TABLE_LOAD_DONE,
    payload: {
        server,
        database,
        done,
    }
})

export const setTableLoadLoading = (server, database, loading) => {
    return {
        type: types.CH_TABLE_LOADING,
        payload: {
            server,
            database,
            loading,
        }
    }
}
// #endregion

// #region - signup
export const setSignupState = isSignedUp => ({
    type: types.SIGNUP,
    payload: { isSignedUp },
})

export const addSignupError = error => ({
    type: types.SIGNUP_ERROR,
    error,
})
// #endregion

// #region - file servers
export const addFileServer = (server) => {
    return {
        type: types.ADD_FILE_SERVER,
        payload: server
    }
}

export const addFileServerError = (error) => {
    return {
        type: types.ADD_FILE_SERVER_ERROR,
        error,
    }
}

export const addFileServers = (servers) => {
    return {
        type: types.ADD_FILE_SERVERS,
        payload: servers
    }
}

export const addFileServersError = (error) => {
    return {
        type: types.ADD_FILE_SERVERS_ERROR,
        error,
    }
}

export const removeFileServer = (name) => {
    return {
        type: types.RM_FILE_SERVER,
        payload: name
    }
}
// #endregion

// #region - general setting
export const saveGSError = error => {
    return {
        type: types.save_GS_ERROR,
        error,
    }
}

export const addGS = setting => {
    const { Aux } = Util
    const defaultSetting = {
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
    }

    if(Aux.isEmptyObject(setting)) {
        setting = defaultSetting
    }

    return {
        type: types.ADD_GS,
        payload: setting,
    }
}

export const addGSError = error => {
    return {
        type: types.ADD_GS_ERROR,
        error,
    }
}

export const changeFormValue = (key, value) => {
    return {
        type: types.CH_FORM_VALUE,
        payload: {
            key,
            value,
        }
    }
}
// #endregion

// #region - loadings
export const setLoginLoading = (loading) => {
    return {
        type: types.CH_LOGIN_LOADING,
        payload: {
            loading,
        }
    }
}

export const setSQLDeployLoading = (loading) => {
    return {
        type: types.CH_SQL_DEPLOY_LOADING,
        payload: {
            loading,
        }
    }
}

export const setSQLLoginLoading = (loading) => {
    return {
        type: types.CH_SQL_LOGIN_LOADING,
        payload: {
            loading,
        }
    }
}

export const setFileLoginLoading = (loading) => {
    return {
        type: types.CH_FILE_LOGIN_LOADING,
        payload: {
            loading,
        }
    }
}

export const setSESaveLoading = (loading) => {
    return {
        type: types.CH_SE_SAVE_LOADING,
        payload: {
            loading,
        }
    }
}

export const setUASaveLoading = (loading) => {
    return {
        type: types.CH_UA_SAVE_LOADING,
        payload: {
            loading,
        }
    }
}

export const setGSSaveLoading = (loading) => {
    return {
        type: types.CH_GS_SAVE_LOADING,
        payload: {
            loading,
        }
    }
}

export const setUserImportLoading = (loading) => {
    return {
        type: types.CH_USER_IMPORT_LOADING,
        payload: {
            loading,
        }
    }
}

export const setUserExpandLoading = (loading) => {
    return {
        type: types.CH_USER_EXPAND_LOADING,
        payload: {
            loading,
        }
    }
}

export const setSignupLoading = (loading) => {
    return {
        type: types.CH_SIGNUP_LOADING,
        payload: {
            loading,
        }
    }
}
// #endregion

// #region - error
export const queueError = error => {
    return {
        type: types.QUEUE_ERROR,
        error,
    }
}

export const dequeueError = id => {
    return {
        type: types.DEQUEUE_ERROR,
        id,
    }
}
// #endregion