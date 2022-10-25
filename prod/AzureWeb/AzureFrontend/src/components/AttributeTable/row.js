import React from 'react'
import propTypes from 'prop-types'
import Checkbox from '../Checkbox'
import './row.css'

const Row = ({
    server, database, table, attribute, checkHandler,
}) => {
    const handler = (checked) => {
        checkHandler(server, database, table, attribute.name, checked)
    }

    return (
        <div className='attr-row'>
            <div className='col col-1 attr-col'>
                <Checkbox checked={attribute.willbeEnforced} style={{ width: '24px', height: '24px', marginTop: '18px' }} handler={handler} />
            </div>
            <div className='col col-3 attr-col'>
                <p>{attribute.name}</p>
            </div>
            <div className='col col-3 attr-col'>
                <p>{attribute.type}</p>
            </div>
            <div className='col col-3 attr-col'>
                <p>{attribute.nullable}</p>
            </div>
        </div>
    )
}

export default Row

Row.propTypes = {
    server: propTypes.string.isRequired,
    database: propTypes.string.isRequired,
    table: propTypes.string.isRequired,
    attribute: propTypes.objectOf(propTypes.oneOfType([propTypes.any, propTypes.objectOf({
        name: propTypes.string.isRequired,
        type: propTypes.string.isRequired,
        nullable: propTypes.string.isRequired,
        enforced: propTypes.bool.isRequired,
        willbeEnforced: propTypes.bool.isRequired,
    })])).isRequired,
    checkHandler: propTypes.func.isRequired,
}
