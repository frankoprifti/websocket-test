import React from 'react'

export default function File({ msg, download, filename, user }) {
    return (
        <div onClick={() => download(msg.text, msg.user + "-" + filename)} className={`file-wrap ${msg.user == user ? 'my-file' : 'nope'}`}>
            <img className='icon' src='https://www.flaticon.com/svg/vstatic/svg/337/337956.svg?token=exp=1620387772~hmac=9dce1c2fdc079aa98803422cdbd93ca6' />
            <p className='filename '>{msg.user}</p>
        </div>
    )
}
