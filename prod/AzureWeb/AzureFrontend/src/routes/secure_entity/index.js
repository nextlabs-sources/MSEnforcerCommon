import { connect } from 'react-redux'
import SecureEntity from './route'
import { fetchColumns, fetchTables, } from './thunk'
import { 
    enforceTable, 
    enforceAttribute, 
    enforceAllAttributes,
} from '../../actions/creators'

const mapState = (state) => {
    const { conn: { tables, columns, enforcer }, misc: { current_server, current_database }, pagination } = state
    const tableEnforcers = enforcer.tables
    const attrEnforcers = enforcer.attributes
    const server = current_server
    const database = current_database
    const curPager = pagination[`${server}/${database}`] || { page: 1, loading: false, done: true }
    const entities = Object.keys(tables)
        .filter((k, index) => database === tables[k].database && server === tables[k].server && tables[k].description)//for tables enforced before but not in current page, the description will be undefined
        .sort((a, b) => tables[a].name.localeCompare(tables[b].name))
        .map((tk) => {
            const attributes = Object.keys(columns)
                .filter(ak => (columns[ak].server === server && columns[ak].database === database && tables[tk].schema === columns[ak].schema && tables[tk].name === columns[ak].table))
                .map(ak => ({ ...columns[ak], ...attrEnforcers[ak] }))
            return {
                ...tables[tk],
                ...tableEnforcers[tk],
                attributes,
            }
        })

    return {
        server,
        database,
        entities,
        pager: curPager,
    }
}

const mapDispatch = (dispatch) => {
    const entityClickHandler = (server, database, table) => {
        dispatch(fetchColumns(server, database, table))
    }

    const checkHandler = (server, database, schema, table, checked) => {
        dispatch(enforceTable({
            name: table,
            schema,
            database,
            server,
            enforcement: {
                enforced: checked,
                willbeEnforced: checked,
            },
        }))
    }

    const attrCheckHandler = (server, database, schema, table, attr, checked) => {
        dispatch(enforceAttribute({
            name: attr,
            table,
            schema,
            database,
            server,
            enforcement: {
                enforced: checked,
                willbeEnforced: checked,
            },
        }))
    }

    const attrCheckAllHandler = (server, database, schema, table, attrs) => (checked) => {
        dispatch(enforceAllAttributes(attrs, {
            server,
            database,
            schema,
            table,
            enforcement: {
                enforced: checked,
                willbeEnforced: checked,
            },
        }))
    }

    const loadMoreClickHandler = e => {
        dispatch(fetchTables)
    }

    return {
        entityClickHandler,
        checkHandler,
        attrCheckHandler,
        attrCheckAllHandler,
        loadMoreClickHandler,
    }
}

export default connect(mapState, mapDispatch)(SecureEntity)
