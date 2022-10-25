import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import propTypes from 'prop-types'

const Sidebar = ({ active, onClose, children }) => {

    const clickHandler = () => {
        onClose(false)
    }
    const sidebar = (
        <CSSTransition in={active} classNames='slide' timeout={200} unmountOnExit>
            <div style={{
                position: 'fixed',
                width: '400px',
                top: 0,
                bottom: 0,
                fontSize: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 0 12px 1px #ccc',
                zIndex: 10,
                overflow: 'auto',
            }}>
                <div style={{ textAlign: 'right' }}>
                    <i style={{ cursor: 'pointer' }} onClick={clickHandler}>
                        <svg width="36" height="36" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </i>
                </div>
                {
                    children
                }
            </div>
        </CSSTransition>
    )

    return ReactDOM.createPortal(sidebar, document.querySelector('#modalRoot'))
}

export default Sidebar

Sidebar.propTypes = {
    active: propTypes.bool.isRequired,
    onClose: propTypes.func.isRequired,
    children: propTypes.arrayOf(propTypes.node).isRequired,
}