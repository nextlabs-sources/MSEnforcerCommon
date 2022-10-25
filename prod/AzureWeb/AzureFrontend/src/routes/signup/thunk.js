import { setSignupState, addSignupError, setSignupLoading, } from '../../actions/creators'
import defaultOptions from '../../defaultOption'

const fetchSignup = infos => (dispatch, getState) => {
    const url = '/api/signup'

    dispatch(setSignupLoading(true))
    fetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({ ...infos, password: window.btoa(infos.password) }),
    })
        .then((res) => {
            if (res.ok) {
                dispatch(setSignupLoading(false))
                dispatch(setSignupState(true))
                setTimeout(url => {
                    window.location.replace(url)
                }, 5000, res.headers.get('Location'))
            } else {
                return res.json().then(payload => Promise.reject(new Error(payload.error)))
            }
        })
        .catch((error) => {
            dispatch(setSignupLoading(false))
            dispatch(addSignupError(error.message))
        })
}

export { fetchSignup }
