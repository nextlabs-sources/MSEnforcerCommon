import * as types from '../../actions/types'

const enforcer = (state = { tables: {}, attributes: {} }, action) => {
    switch (action.type) {
        case types.ENFORCE_TABLE: {
            const { tables } = state
            const {
                name, database, server, schema, enforcement,
            } = action.payload
            const id = `${server}/${database}/${schema}/${name}`

            const stateTable = {
                ...tables,
                [id]: enforcement,
            }
            return { tables: stateTable, attributes: state.attributes }
        }
        case types.ENFORCE_TABLES: {
            const prevTables = state.tables
            const { server, database, tables, enforcement } = action.payload

            const reducedTables = tables.reduce((prev, t) => {
                prev[`${server}/${database}/${t.schema}/${t.name}`] = enforcement
                return prev
            }, {})

            return {
                tables: {
                    ...prevTables,
                    ...reducedTables
                },
                attributes: state.attributes
            }
        }
        case types.ENFORCE_ATTRIBUTE: {
            const { attributes } = state
            const {
                name, table, schema, database, server, enforcement,
            } = action.payload
            const id = `${server}/${database}/${schema}/${table}/${name}`

            const stateAttributes = {
                ...attributes,
                [id]: enforcement,
            }
            return {
                tables: state.tables,
                attributes: stateAttributes,
            }
        }
        case types.ENFORCE_ALL_ATTRIBUTES: {
            const {
                server, database, schema, table, attrs, enforcement,
            } = action.payload
            const nextAttrsState = attrs.reduce((prev, attr) => {
                const attrKey = `${server}/${database}/${schema}/${table}/${attr.name}`
                prev[attrKey] = { ...enforcement }
                return prev
            }, {})

            return {
                tables: state.tables,
                attributes: {
                    ...state.attributes,
                    ...nextAttrsState,
                },
            }
        }
        default: {
            return state
        }
    }
}

export default enforcer
