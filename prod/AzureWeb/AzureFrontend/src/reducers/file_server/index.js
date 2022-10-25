import * as types from '../../actions/types'

const fileServer = (state = {}, action) => {
    switch(action.type) {
        case types.ADD_FILE_SERVER: {
            const { name, account, key, proxy }  = action.payload
            if(!name || !account || !key || !proxy) {
                return state
            }
            return {
                ...state,
                [name]: action.payload,
            }
        }
        case types.ADD_FILE_SERVERS: {
            const { servers }  = action.payload
            const reducedServers = servers.reduce((prev, s) => {
                prev[s.name] = s
                return prev
            }, {})

            return {
                ...state,
                ...reducedServers,
            }
        }        
        default: {
            return state
        }
    }
}

export default fileServer