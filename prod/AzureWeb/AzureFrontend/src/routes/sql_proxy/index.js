import { connect } from 'react-redux'
import { ProxyPage } from '../../components'

const mapState = (state, ownProps) => {
    const { match: { params: { id } } } = ownProps
    const { app: { type }, conn: { servers }, fileServers } = state
    const curServer = (type === 'azure_sql' ? servers[decodeURIComponent(id)] : fileServers[decodeURIComponent(id)]) || {}
    
    return {
        serverTitle: 'SQL Server Host Info',
        proxyTitle: 'Proxy Host Info',
        server: curServer.name,
        proxy: curServer.proxy,
    }
}

export default connect(mapState)(ProxyPage)