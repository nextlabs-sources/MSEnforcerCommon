import React from 'react'
import propTypes from 'prop-types'
import Checkbox from '../Checkbox'
import './row.css'

const Header = ({ isAllChecked, checkHandler }) => (
    <div className='attr-row' style={{ fontWeight: '700' }}>
        <div className='col col-1 attr-col'>
            <Checkbox checked={isAllChecked} style={{ width: '24px', height: '24px', marginTop: '18px' }} handler={checkHandler} />
        </div>
        <div className='col col-3 attr-col'>
            <p>Name</p>
        </div>
        <div className='col col-3 attr-col'>
            <p>Data Type</p>
        </div>
        <div className='col col-3 attr-col'>
            <p>Nullable</p>
        </div>
    </div>
)

export default Header

Header.propTypes = {
    isAllChecked: propTypes.bool.isRequired,
    checkHandler: propTypes.func.isRequired,
}
