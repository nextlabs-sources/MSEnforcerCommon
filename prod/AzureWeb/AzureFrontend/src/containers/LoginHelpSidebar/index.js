import React from 'react'
import { connect } from 'react-redux'
import { Sidebar } from '../../components'
import { changeLoginHelpSidebarVisibility } from '../../actions/creators'
import config from '../../config'

const LoginHelpSidebar = ({ active, onClose }) => {
    return (
        <Sidebar active={active} onClose={onClose}>
            <h3 style={{ margin: '1.2em 1.6em' }}>App Registrations</h3>
            <hr/>
            <ol style={{ listStyleType: 'decimal' }}>
                <li><p>Sign in to the <a href='https://portal.azure.com' target='_blank' rel='noopener noreferrer' data-linktype='external' style={{ color: '#18b' }}>Azure portal</a>.</p></li>
                <li><p>If your account gives you access to more than one, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.</p></li>
                <li><p>In the left-hand navigation panel, click the <strong>Azure Active Directory</strong> service, click <strong>Properties</strong>, and copy <strong>Directory ID</strong> in the right panel.</p></li>
                <li><p>Back to the left-hand Azure Active Directory navigation panel, click <strong>App registrations</strong>, and click <strong>New application registration</strong>.</p></li>
                <li>
                    <p>When the Create page appears, enter your application's registration information</p>
                    <ul style={{ listStyleType: 'disc', fontSize: '13px' }}>
                        <li><p><strong>Name</strong>: Enter a meaningful application name</p></li>
                        <li><p><strong>Application Type</strong>: Select "Web app / API"</p></li>
                        <li><p><strong>Sign-On URL</strong>: Enter <span style={{ color: '#18b' }}>{config.App.callback}</span></p></li>
                        <li><p>When finished, click Create. Azure AD assigns a unique Application ID to your application. Copy the Application ID and you're taken to your application's main registration page.</p></li>
                    </ul>
                </li>
                <li>
                    <p>Create application key</p>
                    <ul style={{ listStyleType: 'disc', fontSize: '13px' }}>
                        <li><p>Click the <strong>Keys</strong> tab on the Settings page.</p></li>
                        <li><p>Add a description for your key.</p></li>
                        <li><p>Select either a one or two year duration.</p></li>
                        <li><p>Click <strong>Save</strong>. The right-most column will contain the key value, after you save the configuration changes. Be sure to copy the key for use in your client application code, as it is not accessible once you leave this page.</p></li>
                    </ul>
                </li>
                <li>
                    <p>Grant application permission</p>
                    <ul style={{ listStyleType: 'disc', fontSize: '13px' }}>
                        <li><p>Click the <strong>Required permissions</strong> tab on the Settings page.</p></li>
                        <li><p>Click <strong>Windows Azure Active Directory</strong> tab on the right <strong>Required permissions</strong> section.</p></li>
                        <li>
                            <p>Check the following permissions below <strong>DELETEGATED PERMISSIONS</strong> on the right <strong>Enable Access</strong> section.</p>
                            <ul style={{ listStyleType: 'disc', fontSize: '11px' }}>
                                <li><p>Access the directory as the signed-in user</p></li>
                                <li><p>Read directory data</p></li>
                                <li><p>Read and write directory data</p></li>
                                <li><p>Read and write all groups</p></li>
                                <li><p>Read all groups</p></li>
                                <li><p>Read all users' full profiles</p></li>
                                <li><p>Read all users' basic profiles</p></li>
                                <li><p>Sign in and read user profile</p></li>
                            </ul>
                        </li>
                        <li>
                            <p>Click <strong>Grant Permissions</strong> on the left <strong>Required permissions</strong> section to complete the grant process.</p>
                        </li>
                    </ul>
                </li>                
            </ol>
        </Sidebar>
    )
}

const mapState = state => {
    return {
        active: state.modal.loginHelpSidebar,
    }
}

const mapDispatch = dispatch => {
    const onClose = visible => {
        dispatch(changeLoginHelpSidebarVisibility(visible))
    }

    return {
        onClose,
    }
}

export default connect(mapState, mapDispatch)(LoginHelpSidebar)