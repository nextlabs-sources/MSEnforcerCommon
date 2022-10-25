import { connect } from 'react-redux'
import SQLSetting from './route'
import { fetchGeneralSettings } from './thunk'
import { changeFormValue } from '../../actions/creators'

const mapState = state => {
    const { app: { uid, type }, general_settings, } = state
    return {
        uid,
        type,
        config: general_settings,
    }
}

const mapDispatch = dispatch => {
    const init = () => {
        dispatch(fetchGeneralSettings)
    }

    const onValueChange = (key, value) => {
        if (typeof key === 'string' && typeof value === 'string') {
            dispatch(changeFormValue(key.trim(), value.trim()))
        } else {
            dispatch(changeFormValue(key, value))
        }
    }

    return {
        init,
        onValueChange,
    }
}

export default connect(mapState, mapDispatch)(SQLSetting)