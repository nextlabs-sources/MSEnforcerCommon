import * as types from '../../actions/types'

const misc = (state = {
    current_server: '',
    current_database: '',
    current_file: '',
    latest_sqlserver: '',
    latest_fileserver: '',
}, action) => {
    switch (action.type) {
        case types.SET_CUR_SERVER: {
            const { server } = action.payload
            return {
                ...state,
                current_server: server,
            }
        }
        case types.SET_CUR_DB: {
            const { database } = action.payload
            return {
                ...state,
                current_database: database
            }
        }
        case types.SET_CUR_FILE: {
            const { file } = action.payload
            return {
                ...state,
                current_file: file,
            }
        }
        case types.ADD_LATEST_SQL_SERVER: {
            const { server } = action.payload
            return {
                ...state,
                latest_sqlserver: server,
            }
        }
        case types.ADD_LATEST_FILE_SERVER: {
            const { server } = action.payload
            return {
                ...state,
                latest_fileserver: server,
            }
        }        
        default: {
            return state
        }
    }
}

export default misc
