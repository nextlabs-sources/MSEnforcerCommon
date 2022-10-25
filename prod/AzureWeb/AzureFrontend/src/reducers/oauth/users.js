import * as types from '../../actions/types'

const users = (state = [], action) => {
    switch(action.type) {
        case types.ADD_AD_USERS: {
            return state.concat(action.payload.users)
        }
        default: {
            return state
        }
    }
}

export default users