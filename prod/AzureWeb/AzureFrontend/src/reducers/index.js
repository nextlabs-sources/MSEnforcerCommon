import { CH_LOGIN_STATE } from '../actions/types'
import rootReducer from './root'

const root = (state, action) => {
    if(action.type === CH_LOGIN_STATE && !action.payload.isLoggedIn) {
        return rootReducer({ app: { ...state.app } }, action)
    } else {
        return rootReducer(state, action)
    }
}

export default root
