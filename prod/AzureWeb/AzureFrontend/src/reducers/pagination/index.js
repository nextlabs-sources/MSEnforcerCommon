import * as types from '../../actions/types'

const pagination = (state = {}, action) => {
    switch(action.type) {
        case types.SET_CUR_TABLE_PAGE: {
            const key = `${action.payload.server}/${action.payload.database}`
            const oldState = state[key]

            return {
                ...state,
                [key]: {
                    ...oldState,
                    page: action.payload.page,
                },
            }
        }
        case types.SET_TABLE_LOAD_DONE: {
            const key = `${action.payload.server}/${action.payload.database}`
            const oldState = state[key]

            return {
                ...state,
                [key]: {
                    ...oldState,
                    done: action.payload.done,
                },
            }
        }
        case types.CH_TABLE_LOADING: {
            const key = `${action.payload.server}/${action.payload.database}`
            const oldState = state[key]

            return {
                ...state,
                [key]: {
                    ...oldState,
                    loading: action.payload.loading,
                },
            }
        }
        default: {
            return state
        }
    }
}

export default pagination