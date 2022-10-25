import { connect } from 'react-redux'
import { SEToolbar } from '../../components'
import { saveEnforcedEntities, exportEnforcedEntities } from './thunk'

const mapState = state => {
    const { loading: { seSave } } = state

    return {
        isSaving: seSave,
    }
}

const mapDispatch = dispatch => {
    const saveHandler = () => {
        dispatch(saveEnforcedEntities)
    }

    const exportHandler = () => {
        dispatch(exportEnforcedEntities)
    }

    return {
        saveHandler,
        exportHandler,
    }
}

export default connect(mapState, mapDispatch)(SEToolbar)
