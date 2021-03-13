'use strict'

const base64 = require('base64url')

module.exports = (video, cookie) => {
    return Object.assign({}, video, {
        provider: 'proxy',
        file: toProxyURL(video.originSrc, cookie)
    })
}

const toProxyURL = (url, cookie) => {
    const hash = base64(JSON.stringify({
        cookie,
        domain: url
    }))
    return `https://${process.env.VIRTUAL_HOST}/videoplayback?hash=${hash}`
}