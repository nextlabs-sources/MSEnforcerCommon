import { connect } from 'react-redux'
import { changeFileDeployConfirmVisibility } from '../../actions/creators'
import { ProxyModal } from '../../components'

const mapState = state => {
    
    const { fileServers, misc: { latest_fileserver }, modal: { fileDeployConfirm } } = state
    const server = fileServers[latest_fileserver] || {}

    return {
        server,
        visible: fileDeployConfirm,
    }
}

const mapDispatch = dispatch => {
    
    const onConfirm = () => {
        dispatch(changeFileDeployConfirmVisibility(false))
    }
    
    return {
        onConfirm
    }
}

export default connect(mapState, mapDispatch)(ProxyModal)