import * as types from '../../actions/types'

const isLoggedIn = (state = false, action) => {
    switch (action.type) {
        case types.CH_LOGIN_STATE: {
            const isUserLoggedIn = action.payload.isLoggedIn
            const nextState = isUserLoggedIn

            return nextState
        }
        default: {
            return state
        }
    }
}

const user = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_USER_INFO: {
            const nextState = action.payload
            return nextState
        }
        default: {
            return state
        }
    }
}

export {
    isLoggedIn,
    user,
}
