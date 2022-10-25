import { push } from 'react-router-redux'
import { compile } from 'path-to-regexp'
import {
    addUserInfo,
    changeLoginState,
    changeLoginStateError,
    setLoginLoading,
    addServerInfos,
    addServerInfosError,
    addFileServers,
    addFileServersError,
} from '../../actions/creators'
import * as types from '../../actions/types'
import config from '../../config'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchInitData = (dispatch, getState) => () => {
    const { app: { uid, type } } = getState()
    const url = `/api/proxy/${uid}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    return AuthFetch(url, defaultOptions)
        .then(infos => {
            if (type === 'azure_sql') {
                dispatch(addServerInfos(infos))
            } else {
                dispatch(addFileServers(infos))
            }
            dispatch({ type: types.PERSIST_STATE })
        })
        .catch(error => {
            if (type === 'azure_sql') {
                dispatch(addServerInfosError(error.message))
            } else {
                dispatch(addFileServersError(error.message))
            }
            dispatch({ type: types.PERSIST_STATE })
        })
}

const fetchLogin = (user, password) => (dispatch, getState) => {
    const { app: { uid, type } } = getState()
    const url = `/api/login/${uid}`
    const initData = fetchInitData(dispatch, getState)
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    dispatch(setLoginLoading(true))
    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({
            user,
            password: window.btoa(password),
            type,
        }),
    })
        .then(() => {
            const getDashboardPath = compile(config.Routes.dashboard)

            dispatch(setLoginLoading(false))
            dispatch(changeLoginState(true))
            dispatch(addUserInfo({ name: user }))
            dispatch(push(getDashboardPath({ uid, type })))
            return initData()
        })
        .catch((error) => {
            dispatch(changeLoginStateError(error.message))
            dispatch(setLoginLoading(false))
        })
}

export { fetchLogin }
