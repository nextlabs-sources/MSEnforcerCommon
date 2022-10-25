import * as types from '../../actions/types'

const credential = (state = {
    tenantId: '',//ad2d08bd-a00e-49be-b91a-79f4e00e5738
    appClientId: '',//619f3007-ef3b-4871-a144-057c966775b9
    appClientKey: '',//E6eFHg0z1czURyFrwM1wn+yNfs7aEvcYsldnY9It36A=
}, action) => {
    switch(action.type) {
        case types.ADD_OAUTH_CREDENTIALS: {
            const { tenantId, appClientId, appClientKey } = action.payload
            if(tenantId && appClientId && appClientKey) {
                return {
                    tenantId,
                    appClientId,
                    appClientKey,
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

export default credential