import { connect } from 'react-redux'
import Dashboard from './route'
import { changeServerDeployModalVisibility, changeFileLoginModalVisibility } from '../../actions/creators'

const mapState = state => ({
    type: state.app.type,
})

const mapDispatch = (dispatch) => {
    const addSQLConnHandler = () => {
        dispatch(changeServerDeployModalVisibility(true))
    }
    const addFileConnHandler = () => {
        dispatch(changeFileLoginModalVisibility(true))
    }
    return {
        addSQLConnHandler,
        addFileConnHandler,
    }
}

export default connect(mapState, mapDispatch)(Dashboard)
