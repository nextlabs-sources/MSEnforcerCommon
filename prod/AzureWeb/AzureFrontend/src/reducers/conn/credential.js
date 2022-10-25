import * as types from '../../actions/types'

const credential = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_SERVER_CREDENTIALS: {
            const { server, user, password } = action.payload
            return {
                ...state,
                [server]: {
                    user,
                    password,
                },
            }
        }
        default: {
            return state
        }
    }
}

export default credential
