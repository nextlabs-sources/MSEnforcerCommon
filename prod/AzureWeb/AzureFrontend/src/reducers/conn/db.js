import * as types from '../../actions/types'

const database = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_DBS: {
            const { server, databases = [] } = action.payload
            const newState = databases.reduce((prev, db) => {
                prev[`${server}/${db}`] = { name: db, server }
                return prev
            }, {})
            const nextState = {
                ...state,
                ...newState,
            }
            return nextState
        }
        default: {
            return state
        }
    }
}

export default database
