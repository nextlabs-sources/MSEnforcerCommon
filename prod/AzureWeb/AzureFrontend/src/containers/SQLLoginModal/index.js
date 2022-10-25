import { connect } from 'react-redux'
import { SQLLoginModal } from '../../components'
import { fetchDatabases } from './thunk'
import { changeDBLoginModalVisibility } from '../../actions/creators'

const mapState = (state) => {
    const { modal: { sqlLogin }, loading, conn: { credentials }, misc: { current_server } } = state
    const { user, password } = credentials
    return {
        server: current_server,
        user,
        password,
        visible: sqlLogin,
        isLogging: loading.sqlLogin,
    }
}

const mapDispatch = (dispatch) => {
    const connectHandler = (config) => {
        const { server, user, password } = config
        dispatch(fetchDatabases(server, user, password))
    }
    const cancelHandler = () => {
        dispatch(changeDBLoginModalVisibility(false))
    }
    return {
        connectHandler,
        cancelHandler,
    }
}

export default connect(mapState, mapDispatch)(SQLLoginModal)
