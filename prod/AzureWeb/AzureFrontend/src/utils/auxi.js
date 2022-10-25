import { changeLoginState } from '../actions/creators'
import * as types from '../actions/types'

class Aux {
    static isEmptyObject(obj) {
        return !(obj && Object.keys(obj).length > 0)
    }

    static AuthFetchEnhancer(dispatch, getState) {

        if (typeof dispatch !== 'function' || typeof getState !== 'function') {
            throw new Error('enhance fetch failed, dispatch & getState must be function')
        }

        return (...args) => {
            return fetch(...args).then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        dispatch(changeLoginState(false))
                        dispatch({ type: types.CLEAR_STATE })
                    }
                    return Aux.isJSONResponse(res) ? res.json().then(payload => Promise.reject(new Error(payload.error))) : Promise.reject(new Error(res.statusText))
                } else {
                    return Aux.isJSONResponse(res) ? res.json() : Promise.resolve()
                }
            })
        }
    }

    static isJSONResponse(res) {
        return (res.headers && res.headers.get('Content-Type') && res.headers.get('Content-Type').toLowerCase().indexOf('application/json') > -1)
    }
}

export default Aux