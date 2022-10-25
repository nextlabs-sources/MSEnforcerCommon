import { connect } from 'react-redux'
import AzureOAuth from './route'
import { fetchToken } from './thunk'

const mapDispatch = (dispatch) => {

    const onLoad = code => {
        dispatch(fetchToken(code))
    }

    return {
        onLoad,
    }
}

export default connect(null, mapDispatch)(AzureOAuth)
