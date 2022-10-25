import { connect } from 'react-redux'
import { AuthRoute } from '../../components'

const mapState = (state, ownProps) => {
    return {
        isAuthed: !!state.auth.isLoggedIn,
        uid: ownProps.computedMatch.params.uid || '',
        type: ownProps.computedMatch.params.type || 'unknown',
    }
}

export default connect(mapState, null)(AuthRoute)