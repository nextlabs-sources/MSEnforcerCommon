import { connect } from 'react-redux'
import UserAttibutes from './route'
import { enforceUserAttribute, enforceAllUserAttributes } from '../../actions/creators'
import { checkOAuthCredentials } from './thunk'

const mapState = (state) => {
    const { user_attributes: { attributes, enforcer } } = state
    const computedAttrs = Object.keys(attributes).map(ak => ({ ...attributes[ak], ...enforcer[ak] }))

    return {
        attributes: computedAttrs,
    }
}

const mapDispatch = (dispatch) => {
    
    const init = () => {
        dispatch(checkOAuthCredentials)        
    }
    
    const checkHandler = (attr, checked) => {
        dispatch(enforceUserAttribute(attr, checked))
    }

    const checkAllHandler = attrs => (checked) => {
        dispatch(enforceAllUserAttributes(attrs, checked))
    }

    return {
        init,
        checkHandler,
        checkAllHandler,
    }
}

export default connect(mapState, mapDispatch)(UserAttibutes)
