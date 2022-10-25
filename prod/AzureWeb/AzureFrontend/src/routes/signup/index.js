import { connect } from 'react-redux'
import Signup from './route'
import { fetchSignup } from './thunk'

const mapState = state => ({
    isSignedUp: state.app.signup,
    isSigningup: state.loading.signup
})

const mapDispatch = (dispatch) => {
    const signupHandler = infos => () => {
        dispatch(fetchSignup(infos))
    }

    return {
        signupHandler,
    }
}

export default connect(mapState, mapDispatch)(Signup)
