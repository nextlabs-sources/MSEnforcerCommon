import { changeLoginState, changeLoginStateError } from '../../actions/creators'
import * as types from '../../actions/types'
import defaultOptions from '../../defaultOption'
import Utils from '../../utils'

const { Aux } = Utils
const fetchLogout = (dispatch, getState) => {
    const { app: { uid }, auth: { user: { name } } } = getState()
    const url = `/api/login/out/${uid}?user=${name}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    AuthFetch(url, defaultOptions)
        .then(() => {
            dispatch(changeLoginState(false))
            dispatch({ type: types.CLEAR_STATE })
            return Promise.resolve()
        })
        .catch((error) => {
            dispatch(changeLoginStateError(error.message))
        })
}

export { fetchLogout }
