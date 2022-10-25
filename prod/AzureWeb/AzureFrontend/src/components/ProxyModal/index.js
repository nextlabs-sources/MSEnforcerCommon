import React from 'react'
import ConfirmModal from '../ConfirmModal'

const ProxyModal = ({ server, visible, onConfirm }) => {
    const textboxWrapper = {
        padding: '16px 6px 10px',
    }
    const textbox = {
        width: '100%',
        height: '40px',
    }

    return (
        <ConfirmModal title='Proxy Details' visible={visible} onConfirm={onConfirm}>
            <div style={textboxWrapper}>
                <h4>SQL Server Host Info</h4>
                <input type='text' style={textbox} value={server.name} disabled />
            </div>
            <div style={textboxWrapper}>
                <h4>Proxy Host Info</h4>
                <input type='text' style={textbox} value={server.proxy} disabled />
            </div>
        </ConfirmModal>
    )
}

export default ProxyModal