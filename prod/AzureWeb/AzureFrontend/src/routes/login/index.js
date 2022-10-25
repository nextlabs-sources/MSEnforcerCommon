import { connect } from 'react-redux'
import Login from './route'
import { addClientID, addClientType } from '../../actions/creators'
import { fetchLogin } from './thunk'

const loginHandler = dispatch => (user, password) => () => {
    dispatch(fetchLogin(user, password))
}

const mapState = (state) => {
    const { loading: { login } } = state

    return {
        isLogging: login,
    }
}

const mapDispatch = (dispatch) => {
    const addLoginClient = (uid, type) => {
        dispatch(addClientID(uid))
        dispatch(addClientType(type))
    }

    return {
        addLoginClient,
        loginHandler: loginHandler(dispatch),
    }
}

export default connect(mapState, mapDispatch)(Login)
