import * as types from '../../actions/types'
import config from '../../config'
import cacheSvc from '../../cache'

const Persistor = store => next => action => {
    if(!action) {
        return
    }

    const { getState } = store
    const { type } = action

    if(type === types.PERSIST_STATE) {
        cacheSvc.setCache(config.App.localStorageKey, JSON.stringify(getState()))
    } else if(type === types.CLEAR_STATE) {
        cacheSvc.setCache(config.App.localStorageKey, '')
    } else {
        next(action)
    }
}

export default Persistor