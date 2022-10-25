import React from 'react'
import propTypes from 'prop-types'
import Button from '../Button'

const SEToolbar = ({ isSaving, saveHandler, exportHandler }) => (
    <div style={{
        display: 'inline-block', verticalAlign: 'top', marginTop: '12px', overflow: 'hidden',
    }}
    >
        <Button className='btn-primary btn-md toolbar-btn' onClick={saveHandler} loading={isSaving}>Save</Button>
        <Button className='btn-primary btn-md toolbar-btn' onClick={exportHandler} loading={isSaving}>Export & Save</Button>
    </div>
)

export default SEToolbar

SEToolbar.propTypes = {
    saveHandler: propTypes.func.isRequired,
    exportHandler: propTypes.func.isRequired,
}
