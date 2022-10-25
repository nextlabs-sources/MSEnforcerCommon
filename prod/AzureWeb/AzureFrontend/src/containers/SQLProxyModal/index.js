import { connect } from 'react-redux'
import { changeSQLDeployConfirmVisibility } from '../../actions/creators'
import { ProxyModal } from '../../components'

const mapState = state => {
    
    const { conn: { servers }, misc: { latest_sqlserver }, modal: { sqlDeployConfirm } } = state
    const server = servers[latest_sqlserver] || {}

    return {
        server,
        visible: sqlDeployConfirm,
    }
}

const mapDispatch = dispatch => {
    
    const onConfirm = () => {
        dispatch(changeSQLDeployConfirmVisibility(false))
    }
    
    return {
        onConfirm
    }
}

export default connect(mapState, mapDispatch)(ProxyModal)