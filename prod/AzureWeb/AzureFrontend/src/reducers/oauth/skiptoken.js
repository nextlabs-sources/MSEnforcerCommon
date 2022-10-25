import * as types from '../../actions/types'

const skipToken = (state = '', action) => {
    if(action.type === types.ADD_SKIPTOKEN) {
        return action.payload.skiptoken
    }
    return state
}

export default skipToken