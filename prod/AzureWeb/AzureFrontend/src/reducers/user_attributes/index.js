import { combineReducers } from 'redux'
import * as types from '../../actions/types'

const attributes = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_USER_ATTRIBUTES: {
            const attrs = action.payload.attributes
            let nextState = {
                ...state,
            }

            nextState = attrs.reduce((prev, attr) => {
                prev[attr.name] = attr
                return prev
            }, nextState)

            return nextState
        }
        default: {
            return state
        }
    }
}

const enforcer = (state = {}, action) => {
    switch (action.type) {
        case types.ENFORCE_USER_ATTRIBUTE: {
            const { name, enforcement } = action.payload
            const nextState = {
                ...state,
                [name]: enforcement,
            }
            return nextState
        }
        case types.ENFORCE_PARTIAL_USER_ATTRIBUTES: {
            const { attrs, enforcement } = action.payload
            const nextState = attrs.reduce((prev, attr) => {
                prev[attr] = { ...enforcement }
                return prev
            }, {})

            return {
                ...state,
                ...nextState,
            }
        }
        case types.ENFORCE_ALL_USER_ATTRIBUTES: {
            const { attrs, enforcement } = action.payload
            const nextState = attrs.reduce((prev, attr) => {
                prev[attr] = { ...enforcement }
                return prev
            }, {})

            return {
                ...state,
                ...nextState,
            }
        }
        default: {
            return state
        }
    }
}

export default combineReducers({
    attributes,
    enforcer,
})
