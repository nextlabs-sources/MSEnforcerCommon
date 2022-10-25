import React from 'react'
import propTypes from 'prop-types'
import './index.css'

const Button = ({ className, onClick, loading = false, children }) => {

    const btnClass = loading ? `btn-loading ${className}` : className

    return (
        <button className={btnClass} style={{ position: 'relative' }} onClick={!loading ? onClick : null}>
            {
                loading ? <i className='btn-spinner'></i> : null
            }
            {
                loading ? <span style={{marginLeft: '14px', verticalAlign: 'top'}}>{children}</span> : <span>{children}</span>
            }
        </button>
    )
}

export default Button

Button.propTypes = {
    className: propTypes.string.isRequired,
    onClick: propTypes.func.isRequired,
    loading: propTypes.bool,
    children: propTypes.node.isRequired,
}