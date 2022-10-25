import React from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import MessagePopup from '../MessagePopup'

const MessagePopups = ({ messages, onDisappear }) => {
    const popups = (
        <div>
            {
                messages.map(m => <MessagePopup key={m.id} id={m.id} type={m.type} message={m.message} onDisappear={onDisappear} />)
            }
        </div>
    )
    return ReactDOM.createPortal(popups, document.querySelector('#errorRoot'))    
}

export default MessagePopups

MessagePopups.propTypes = {
    messages: propTypes.arrayOf(propTypes.shape({
        id: propTypes.number.isRequired,
        type: propTypes.string.isRequired,
        message: propTypes.string.isRequired,
    })).isRequired,
    onDisappear: propTypes.func.isRequired,
}
