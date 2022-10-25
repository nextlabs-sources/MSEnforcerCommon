import { connect } from 'react-redux'
import { MessagePopups } from '../../components'
import { dequeueError } from '../../actions/creators'

const mapState = state => {
    
    const errs = state.errors.map(e => ({ id: e.id, type: 'error', message: e.message }))

    return {
        messages: errs,
    }
}

const mapDispatch = dispatch => {
    const onDisappear = id => {
        dispatch(dequeueError(id))
    }

    return {
        onDisappear,
    }
}

export default connect(mapState, mapDispatch)(MessagePopups)