import * as types from '../../actions/types'

const tokens = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_TOKEN: {
            const { token } = action.payload
            return token
        }
        case types.REFRESH_TOKEN: {
            const { resource, token } = action.payload
            const nextState = { ...state, [resource]: token }

            return nextState
        }
        default: return state
    }
}

export default tokens
