import { connect } from 'react-redux'
import { SQLDeployModal } from '../../components'
import { changeServerDeployModalVisibility } from '../../actions/creators'
import { fetchProxy } from './thunk'

const mapState = state => {
    const visible = state.modal.sqlDeploy
    const isDeploying = state.loading.sqlDeploy
    
    return {
        visible,
        isDeploying,
    }
}

const mapDispatch = dispatch => {

    const deployHandler = ({ server }) => {
        dispatch(fetchProxy(server))
    }

    const cancelHandler = () => {
        dispatch(changeServerDeployModalVisibility(false))
    }

    return {
        deployHandler,
        cancelHandler,
    }
}

export default connect(mapState, mapDispatch)(SQLDeployModal)