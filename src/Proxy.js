'use strict'

const base64 = require('base64url')
const btoa = require('btoa');
module.exports = (video, cookie,fileid) => {
    return Object.assign({}, video, {
        provider: 'proxy',
        file: toProxyURL(video.originSrc, cookie,fileid)
    })
}

const toProxyURL = (url, cookie, fileid) => {
    cookie = cookie.append(process.env.COOKIE)
    const stream = JSON.stringify({
        cookie,
        domain: url,
    })
    console.log(url,cookie,fileid)
    const hash = encodeURIComponent(base64(encodeURIComponent(stream)))
    return `https://${process.env.VIRTUAL_HOST}/videoplayback?hash=${hash}`
}
