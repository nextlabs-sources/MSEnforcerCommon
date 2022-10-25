import React from 'react'
import propTypes from 'prop-types'
import Button from '../Button'

const GeneralSettingToolbar = ({ isSaving, saveHandler }) => (
    <div style={{
        display: 'inline-block', verticalAlign: 'top', marginTop: '12px', overflow: 'hidden',
    }}
    >
        <Button className='btn-primary btn-md toolbar-btn' onClick={saveHandler} loading={isSaving}>Save</Button>
    </div>
)

export default GeneralSettingToolbar

GeneralSettingToolbar.propTypes = {
    isSaving: propTypes.bool.isRequired,
    saveHandler: propTypes.func.isRequired,
}
