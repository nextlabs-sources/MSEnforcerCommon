import React from 'react'
import propTypes from 'prop-types'

const Checkbox = ({ checked = false, handler, style }) => {
    const innerStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        border: checked ? '2px solid #06c' : '2px solid #999',
        borderRadius: '3px',
        boxSizing: 'border-box',
        backgroundColor: checked ? '#06c' : '#fff',
        backgroundClip: 'content-box',
        cursor: 'pointer',
    }

    const mergeStyle = {
        ...innerStyle,
        ...style,
    }

    const clickHandler = (e) => {
        e.stopPropagation()

        if (handler) {
            handler(!checked)
        }
    }
    
    return (
        <div style={mergeStyle} onClick={clickHandler} role='checkbox' aria-checked={checked} tabIndex={-1}>
            <svg focusable="false" width="100%" height="100%" viewBox="0 0 24 24" aria-hidden="true" preserveAspectRatio='xMinYMin meet'>
                <path fill='#fff' d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        </div>
    )
}

export default Checkbox

Checkbox.propTypes = {
    checked: propTypes.bool,
    handler: propTypes.func.isRequired,
    style: propTypes.objectOf(propTypes.string),
}
