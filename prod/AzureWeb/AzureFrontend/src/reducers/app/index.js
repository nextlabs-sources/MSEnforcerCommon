import { combineReducers } from 'redux'
import * as types from '../../actions/types'

const uid = (state = '', action) => {
    switch (action.type) {
        case types.ADD_CLIENT_ID: {
            const nextState = action.payload.uid
            return nextState
        }
        default: {
            return state
        }
    }
}

const type = (state = '', action) => {
    switch (action.type) {
        case types.ADD_CLIENT_TYPE: {
            const nextState = action.payload.type
            return nextState
        }
        default: {
            return state
        }
    }
}

const signup = (state = false, action) => {
    switch (action.type) {
        case types.SIGNUP: {
            const nextState = action.payload.isSignedUp
            return nextState
        }
        default: {
            return state
        }
    }
}

export default combineReducers({
    uid,
    type,
    signup,
})
