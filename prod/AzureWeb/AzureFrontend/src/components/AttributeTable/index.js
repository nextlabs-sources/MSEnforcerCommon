import React from 'react'
import propTypes from 'prop-types'
import Row from './row'
import Header from './header'

const AttributeTable = ({ table = '', attributes = [] }, context) => {
    const {
        server, database, attrCheckHandler, attrCheckAllHandler,
    } = context

    return (
        <div style={{
            backgroundColor: 'rgb(250, 250, 250)',
            boxShadow: '0 0 4px 1px #ccc',
            borderRadius: '4px',
        }}
        >
            <Header isAllChecked={attributes.filter(a => !a.willbeEnforced).length === 0} checkHandler={attrCheckAllHandler(server, database, table, attributes)} />
            {
                attributes.map(a => <Row key={`${server}/${database}/${table}/${a.name}`} server={server} database={database} table={table} attribute={a} checkHandler={attrCheckHandler} />)
            }
        </div>
    )
}

AttributeTable.contextTypes = {
    server: propTypes.string,
    database: propTypes.string,
    attrCheckHandler: propTypes.func,
    attrCheckAllHandler: propTypes.func,
}

export default AttributeTable

AttributeTable.propTypes = {
    table: propTypes.string.isRequired,
    attributes: propTypes.arrayOf(propTypes.oneOfType([propTypes.any, propTypes.objectOf({
        name: propTypes.string.isRequired,
        type: propTypes.string.isRequired,
        nullable: propTypes.string.isRequired,
        enforced: propTypes.bool.isRequired,
        willbeEnforced: propTypes.bool.isRequired,
    })])).isRequired,
}
