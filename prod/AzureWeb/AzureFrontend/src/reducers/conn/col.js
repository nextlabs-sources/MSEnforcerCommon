import * as types from '../../actions/types'

const col = (state = {}, action) => {
    switch (action.type) {
        case types.ADD_COLUMNS: {
            const {
                server, database, schema, table, columns,
            } = action.payload
            const cols = columns.map(c => ({
                name: c.name,
                type: c.type,
                nullable: c.nullable,
                table,
                schema,
                database,
                server,
            })).reduce((prev, c) => {
                prev[`${server}/${database}/${schema}/${table}/${c.name}`] = c
                return prev
            }, {})

            const nextState = {
                ...state,
                ...cols,
            }
            return nextState
        }
        default: {
            return state
        }
    }
}

export default col
