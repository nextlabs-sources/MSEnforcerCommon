const setCache = (key, val) => {
    window.localStorage.setItem(key, val)
}

const getCache = key => window.localStorage.getItem(key)

export default {
    getCache,
    setCache,
}
