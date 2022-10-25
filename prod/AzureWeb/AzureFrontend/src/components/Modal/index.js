import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import propTypes from 'prop-types'

const Modal = ({ active, children }) => {

    const modal = (
        <CSSTransition in={active} classNames='fade' timeout={200} unmountOnExit>
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'rgba(255, 255, 255, .8)',
                fontSize: '16px',
                zIndex: 9,
            }}
            >
                {
                    React.Children.only(children)
                }
            </div>
        </CSSTransition>            
    )

    return ReactDOM.createPortal(modal, document.querySelector('#modalRoot'))
}
export default Modal

Modal.propTypes = {
    active: propTypes.bool.isRequired,
    children: propTypes.node.isRequired,
}