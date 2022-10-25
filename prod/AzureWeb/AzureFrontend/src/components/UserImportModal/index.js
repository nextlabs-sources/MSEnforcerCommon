import React from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'
import Checkbox from '../Checkbox'
import './index.css'

const UserImportModal = ({ users, hasNextPage, isImporting, isLoading, visible, importHandler, loadHandler, cancelHandler, checkHandler, checkAllHandler, }) => {

    const checkboxHandler = objectId => checked => {
        checkHandler(objectId, checked)
    }
    const isAllChecked = users.length === users.filter(u => u.checked).length

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
                <div style={{ height: '30px', overflow: 'hidden', padding: '16px' }}>
                    <h3 style={{ margin: 0 }}>Select users to be imported</h3>
                </div>
                <div style={{
                    height: 'calc(100% - 130px)',
                }}
                >
                    <div style={{ margin: '16px' }}>
                        <Checkbox checked={isAllChecked} style={{ width: '24px', height: '24px' }} handler={checkAllHandler(users.map(u => u.objectId))}/>
                        <h3 style={{ display: 'inline-block', margin: '0 16px' }}>Select All</h3>
                    </div>
                    <ul style={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        height: 'calc(100% - 72px)',
                    }}>
                        {
                            users.map(u => {
                                return (
                                    <li key={u.objectId} style={{ margin: '16px' }}>
                                        <Checkbox checked={u.checked} style={{ width: '24px', height: '24px' }} handler={checkboxHandler(u.objectId)} />
                                        <span style={{ margin: '0 16px' }}>{u.displayName}</span>
                                    </li>
                                )
                            })
                        }
                        <div style={{ margin: '16px' }}>
                            <p onClick={loadHandler} style={{ margin: '0', display: (!isLoading && hasNextPage) ? 'block' : 'none', textAlign: 'center', color: '#06c', fontSize: '11px', cursor: 'pointer' }}>Load More</p>
                            <p style={{ margin: '0', display: isLoading ? 'block' : 'none', textAlign: 'center', }}><i className='text-spinner'></i></p>
                        </div>
                    </ul>
                </div>
                <div style={{
                    textAlign: 'center',
                    height: '60px',
                    overflow: 'hidden',
                }}
                >
                    <Button className='btn-primary btn-md modal-btn' onClick={importHandler} loading={isImporting}>Import</Button>
                    <Button className='btn-default btn-md modal-btn' onClick={cancelHandler}>Cancel</Button>
                </div>
            </div>
        </Modal>
    )
}

export default UserImportModal

UserImportModal.propTypes = {
    users: propTypes.arrayOf(propTypes.shape({
        objectId: propTypes.string.isRequired,
        displayName: propTypes.string.isRequired,
        checked: propTypes.bool.isRequired,
    })).isRequired,
    hasNextPage: propTypes.bool.isRequired,
    isImporting: propTypes.bool.isRequired,
    isLoading: propTypes.bool.isRequired,
    visible: propTypes.bool.isRequired,
    importHandler: propTypes.func.isRequired,
    loadHandler: propTypes.func.isRequired,
    cancelHandler: propTypes.func.isRequired,
    checkHandler: propTypes.func.isRequired,
}
