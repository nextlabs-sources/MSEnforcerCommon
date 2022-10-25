import { connect } from 'react-redux'
import { UserLoadModal } from '../../components'
import { changeUserLoadVisibility, changeLoginHelpSidebarVisibility, } from '../../actions/creators'
import { persistState } from './thunk'

const mapState = state => {
    const { modal: { userLoad }, oauth: { credentials } } = state
    const { tenantId, appClientId, appClientKey } = credentials

    return {
        visible: userLoad,
        isLoading: false,
        tenantId,
        appClientId,
        appClientKey,
    }
}

const mapDispatch = dispatch => {

    const loadHandler = infos => {
        dispatch(persistState(infos))
    }

    const cancelHandler = () => {
        dispatch(changeUserLoadVisibility(false))
    }

    const helpHandler = () => {
        //dispatch(changeLoginHelpSidebarVisibility(true))
        var curWwwPath=window.document.location.href;
        var pathName=window.document.location.pathname; 
        var pos=curWwwPath.indexOf(pathName); 
        var localhostPaht=curWwwPath.substring(0,pos);
        window.open(localhostPaht + "/helpdoc/azuresql/index.html");
    }

    return {
        loadHandler,
        cancelHandler,
        helpHandler,
    }
}

export default connect(mapState, mapDispatch)(UserLoadModal)
