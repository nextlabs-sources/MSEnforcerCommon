import * as types from '../../actions/types'

const server = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_SERVER_INFO: {
            const { server, proxy } = action.payload
            return {
                ...state,
                [server]: {
                    name: server,
                    proxy,
                },
            }
        }
        case types.ADD_SERVER_INFOS: {
            const { servers } = action.payload
            if(servers) {
                const reducedServers = servers.reduce((prev, s) => {
                    prev[s.name] = s
                    return prev
                }, {})
    
                return {
                    ...state,
                    ...reducedServers,
                }
            } else {
                return state
            }
        }        
        default: {
            return state
        }
    }
}

export default server
