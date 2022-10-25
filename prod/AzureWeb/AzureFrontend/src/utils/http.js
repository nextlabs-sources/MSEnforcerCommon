class HttpUtil {
    static download(filename, content) {
        const anchor = document.createElement('a')
        
        anchor.download = filename
        anchor.href = `data:text/plain,${content}`
        anchor.style.position = 'fixed'
        anchor.style.display = 'none'
        document.body.appendChild(anchor)
        anchor.click()
    }
}

export default HttpUtil