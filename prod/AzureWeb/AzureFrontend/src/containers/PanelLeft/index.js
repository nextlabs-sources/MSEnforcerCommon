import { connect } from 'react-redux'
import { PanelLeft } from '../../components'
import { setCurrentServer, setCurrentDB, setCurrentFile } from '../../actions/creators'
import { 
    checkServerCredentials,
    fetchTables, 
    fetchEnforcedTables,
} from './thunk'

const mapState = (state) => {
    const { conn: { servers, databases }, app: { uid, type }, fileServers, misc: { current_server } } = state
    const currentDatabases = (
        Object.keys(databases)
        .filter(dk => databases[dk].server === current_server)
        .reduce((prev, dk) => {
            prev[dk] = databases[dk]
            return prev
        }, {})
    )
    return {
        uid,
        servers,
        databases: currentDatabases,
        type,
        fileServers,        
    }
}

const mapDispatch = (dispatch) => {

    const serverTabHandler = (server) => {
        dispatch(setCurrentServer(server))
        dispatch(checkServerCredentials)
    }

    const dbTabHandler = (server, database) => {
        dispatch(setCurrentDB(database))
        dispatch(checkServerCredentials)
        dispatch(fetchTables)
        dispatch(fetchEnforcedTables(server, database))
    }

    const fileTabHandler = (id) => {
        dispatch(setCurrentFile(id))
    }

    return {
        serverTabHandler,
        dbTabHandler,
        fileTabHandler,
    }
}

export default connect(mapState, mapDispatch)(PanelLeft)
