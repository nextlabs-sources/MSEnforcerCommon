import * as types from '../../actions/types'

const table = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_TABLES: {
            const { server, database, tables } = action.payload
            const tableDict = tables.reduce((prev, t) => {
                const tableNormalized = {
                    name: t.name,
                    schema: t.schema,
                    description: `Schema: ${t.schema}, Type: ${t.type}`,
                    database,
                    server,
                }
                prev[`${server}/${database}/${tableNormalized.schema}/${tableNormalized.name}`] = tableNormalized
                return prev
            }, {})
            const nextState = {
                ...state,
                ...tableDict,
            }
            return nextState
        }
        case types.ADD_UNLOAD_TABLES: {
            const { server, database, tables } = action.payload            
            const tableDict = tables.reduce((prev, t) => {
                const tableNormalized = {
                    name: t.name,
                    schema: t.schema,
                    database,
                    server,
                }
                const key = `${server}/${database}/${tableNormalized.schema}/${tableNormalized.name}`
                prev[key] = { ...state[key], ...tableNormalized }
                return prev
            }, {})
            const nextState = {
                ...state,
                ...tableDict,
            }
            return nextState            
        }
        default: {
            return state
        }
    }
}

export default table
