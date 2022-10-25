import React from 'react'
import propTypes from 'prop-types'
import Button from '../Button'

const UAToolbar = ({ isSaving, importHandler, saveHandler, }) => (
    <div style={{
        display: 'inline-block', verticalAlign: 'top', marginTop: '12px', overflow: 'hidden',
    }}
    >
        <Button className='btn-primary btn-md toolbar-btn' onClick={importHandler} loading={false}>Import Users</Button>    
        <Button className='btn-primary btn-md toolbar-btn' onClick={saveHandler} loading={isSaving}>Save</Button>
    </div>
)

export default UAToolbar

UAToolbar.propTypes = {
    importHandler: propTypes.func.isRequired,
    saveHandler: propTypes.func.isRequired,
}
