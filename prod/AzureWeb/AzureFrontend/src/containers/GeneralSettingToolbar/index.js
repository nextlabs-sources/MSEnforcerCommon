import { connect } from 'react-redux'
import { GeneralSettingToolbar } from '../../components'
import { saveGS } from './thunk'

const mapState = state => {
    const { loading: { gsSave } } = state
    
    return {
        isSaving: gsSave
    }
}

const mapDispatch = dispatch => {
    const saveHandler = () => {
        dispatch(saveGS)
    }

    return {
        saveHandler,
    }
}

export default connect(mapState, mapDispatch)(GeneralSettingToolbar)
