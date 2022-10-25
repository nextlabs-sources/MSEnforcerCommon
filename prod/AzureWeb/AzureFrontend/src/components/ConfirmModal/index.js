import React from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'

const ConfirmModal = ({ title, visible, onConfirm, children }) => {
    return (
        <Modal active={visible}>
            <div style={{
                boxSizing: 'border-box',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '800px',
                maxHeight: '480px',
                minWidth: '640px',
                height: '480px',
                padding: '20px 30px',
                boxShadow: '0 0 12px 1px #ccc',
                backgroundColor: '#fff',
            }}
            >
                <div style={{
                    height: '15%',
                }}
                >
                    <h3>{title}</h3>
                </div>
                <div style={{
                    height: '70%',
                }}
                >
                    {
                        children
                    }
                </div>
                <div style={{
                    textAlign: 'center',
                    height: '15%',
                }}
                >
                    <Button className='btn-primary btn-md sql-login-btn' onClick={onConfirm}>Confirm</Button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmModal

ConfirmModal.propTypes = {
    title: propTypes.string.isRequired,
    visible: propTypes.bool.isRequired,
    onConfirm: propTypes.func.isRequired,
    children: propTypes.arrayOf(propTypes.node),
}
