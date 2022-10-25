import { connect } from 'react-redux'
import { UserImportModal } from '../../components'
import { checkADUser, checkAllADUsers, changeUserImportVisibility } from '../../actions/creators'
import { importUsers, fetchADUsers, } from './thunk'

const mapState = state => {
    
    const { modal: { userImport }, oauth: { users, importedUsers, skiptoken, }, loading, } = state
    const reducedUsers = users.map(u => {
        return {
            objectId: u.objectId,
            displayName: u.displayName,
            checked: !!importedUsers[u.objectId]
        }
    })
    
    return {
        hasNextPage: !!skiptoken,
        isImporting: loading.userImport,
        isLoading: loading.userExpand,
        visible: userImport,
        users: reducedUsers,
    }
}

const mapDispatch = dispatch => {

    const importHandler = () => {
        dispatch(importUsers)
    }

    const checkHandler = (objectId, checked) => {
        dispatch(checkADUser(objectId, checked))
    }

    const cancelHandler = () => {
        dispatch(changeUserImportVisibility(false))
    }

    const loadHandler = () => {
        dispatch(fetchADUsers)
    }

    const checkAllHandler = uids => checked => {
        dispatch(checkAllADUsers(uids, checked))
    }

    return {
        importHandler,
        cancelHandler,
        checkHandler,
        checkAllHandler,
        loadHandler,
    }
}

export default connect(mapState, mapDispatch)(UserImportModal)