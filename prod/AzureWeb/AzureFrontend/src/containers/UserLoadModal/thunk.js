import cache from '../../cache'
import config from '../../config'
import { 
    changeUserLoadVisibility, 
    addOAuthCredentials
} from '../../actions/creators'

const persistState = (infos) => (dispatch, getState) => {
    const { tenantId, appClientId } = infos
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/authorize?
    client_id=${appClientId}
    &redirect_uri=${config.App.callback}
    &resource=${config.Resource.users}
    &response_type=code
    &response_mode=query`

    dispatch(addOAuthCredentials(infos))
    dispatch(changeUserLoadVisibility(false))

    cache.setCache(config.App.localStorageKey, JSON.stringify(getState()))

    if(window.location.replace) {
        window.location.replace(url)
    } else {
        window.location.href = url
    }
}

export {    
    persistState
}
