import * as types from '../../actions/types'

const importedUsers = (state = {}, action) => {
    switch(action.type) {
        case types.CHECK_AD_USER: {
            const { objectId, checked } = action.payload

            return {
                ...state,
                [objectId]: checked
            }
        }
        case types.CHECK_ALL_AD_USERS: {
            const { uids, checked } = action.payload
            const nextState = uids.reduce((prev, uid) => {
                prev[uid] = checked
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

export default importedUsers