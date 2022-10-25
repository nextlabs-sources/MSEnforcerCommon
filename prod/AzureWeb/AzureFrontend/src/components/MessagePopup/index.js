import React, { Component } from 'react'
import propTypes from 'prop-types'

const colors = {
    info: '#09c',
    error: '#c33',
    warning: '#c90',
}

class MessagePopup extends Component {
    componentDidMount() {
        const { id, onDisappear } = this.props

        setTimeout(() => {
            onDisappear && onDisappear(id)
        }, 3000)
    }

    render() {
        const { message, type } = this.props

        return (
            <div style={{
                margin: '0',
                padding: '0 32px',
                height: '30px',
                lineHeight: '30px',
                wordWrap: 'nowrap',
                overflow: 'hidden',
                color: '#fff',
                fontSize: '16px',
                backgroundColor: colors[type],
                border: '0 none',
            }}>
                <p style={{ margin: '0' }}>{message}</p>
            </div>
        )
    }
}

export default MessagePopup

MessagePopup.propTypes = {
    id: propTypes.number.isRequired,
    type: propTypes.string.isRequired,
    message: propTypes.string.isRequired,
    onDisappear: propTypes.func.isRequired,
}