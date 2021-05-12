import React from 'react'

export default function File({ msg, download, filename, user }) {
    return (
        <div onClick={() => download(msg.text, msg.user + "-" + filename)} className={`file-wrap ${msg.user === user ? 'my-file' : 'nope'}`}>
            <img alt={'fileicon'} className='icon' src='https://archive.org/download/txt-file-20-504249/txt-file-20-504249.png' />
            <p className='filename '>{msg.user}</p>
        </div>
    )
}
