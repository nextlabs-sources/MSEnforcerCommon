import React from 'react'
import propTypes from 'prop-types'
import { Checkbox } from '../../components'
import './row.css'

const Row = ({ attribute, checkHandler }) => {
    const handler = (checked) => {
        checkHandler(attribute.name, checked)
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
        </div>
    )
}

export default Row

Row.propTypes = {
    attribute: propTypes.objectOf(propTypes.oneOfType([propTypes.any, propTypes.objectOf({
        name: propTypes.string.isRequired,
        type: propTypes.string.isRequired,
        enforced: propTypes.bool.isRequired,
        willbeEnforced: propTypes.bool.isRequired,
    })])).isRequired,
    checkHandler: propTypes.func.isRequired,
}
