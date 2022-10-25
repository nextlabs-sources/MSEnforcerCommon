import * as types from '../../actions/types'

const error = (state = [], action) => {
    switch(action.type) {
        case types.QUEUE_ERROR: {
            state = state.concat(action.error)
            return state
        }
        case types.DEQUEUE_ERROR: {
            state = state.filter(e => e.id !== action.id)
            return state
        }
        default: {
            return state
        }
    }
}

export default error