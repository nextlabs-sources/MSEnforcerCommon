import { connect } from 'react-redux'
import { FileLoginModal } from '../../components'
import { fetchProxy } from './thunk'
import { changeFileLoginModalVisibility } from '../../actions/creators'

const mapState = (state) => {
    const { modal: { fileLogin }, loading } = state
    return {
        isLogging: loading.fileLogin,
        visible: fileLogin,
    }
}

const mapDispatch = (dispatch) => {
    const deployHandler = (config) => {
        const { server, account, key } = config
        dispatch(fetchProxy(server, account, key))
    }
    const cancelHandler = () => {
        dispatch(changeFileLoginModalVisibility(false))
    }
    return {
        deployHandler,
        cancelHandler,
    }
}

export default connect(mapState, mapDispatch)(FileLoginModal)
