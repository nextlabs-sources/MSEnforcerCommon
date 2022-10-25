import { connect } from 'react-redux'
import { Navbar } from '../../components'
import { fetchLogout } from './thunk'

const mapState = (state) => {
    const { app: { uid }, auth: { isLoggedIn } } = state
    const url = `/login/${uid}`
    return {
        url,
        isLoggedIn,
    }
}

const mapDispatch = (dispatch) => {
    const logoutHandler = () => {
        dispatch(fetchLogout)
    }

    return {
        logoutHandler,
    }
}

export default connect(mapState, mapDispatch)(Navbar)
