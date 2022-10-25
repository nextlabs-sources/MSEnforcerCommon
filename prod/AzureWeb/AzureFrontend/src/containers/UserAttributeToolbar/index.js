import { connect } from 'react-redux'
import { UAToolbar } from '../../components'
import { saveAttributes, importUsers, } from './thunk'

const mapState = state => {
    const { loading: { uaSave } } = state
    return {
        isSaving: uaSave
    }
}

const mapDispatch = dispatch => {

    const importHandler = () => {
        dispatch(importUsers)
    }

    const saveHandler = () => {
        dispatch(saveAttributes)
    }

    return  {
        importHandler,
        saveHandler,
    }
}

export default connect(mapState, mapDispatch)(UAToolbar)