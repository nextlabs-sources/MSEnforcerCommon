import { queueError } from '../../actions/creators'

const ErrorQueue = store => next => action => {
    
    if(!action) {
        return
    }
    
    const { dispatch } = store
    const { type, error } = action

    if(typeof type === 'string' && type.slice(-5) === 'error' && error) {
        dispatch(queueError({
            id: window.errorId++,
            message: error,
        }))
        next(action)
    } else {
        next(action)
    }
}

export default ErrorQueue