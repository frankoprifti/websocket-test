import logo from './logo.svg';
import { useEffect, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import shortid from 'shortid'
import FileBase64 from 'react-file-base64';
import File from './file'



import './App.css';

function App() {
  const [connected] = useState(true)
  const [messages, setmessages] = useState([])
  const [user] = useState(shortid.generate())
  const [msg, setMsg] = useState(null)
  const [client] = useState(W3CWebSocket('wss://fj4q35htag.execute-api.eu-west-2.amazonaws.com/Prod'))
  const [filename, setfilename] = useState(null)

  useEffect(() => {
    client.onmessage = (message) => {
      var msgState = messages
      var json = JSON.parse(message.data)
      msgState.push({ text: json.text, user: json.user })
      setmessages([...msgState])
    };
  }, [client, messages])

  const sendMessage = async () => {

    waitForSocketConnection(client, function () {
      console.log("message sent!!!");
      client.send(JSON.stringify({ data: JSON.stringify({ text: msg, user: user }), action: 'sendmessage' }));
    });
  }
  function waitForSocketConnection(socket, callback) {
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if (callback != null) {
            callback();
          }
        } else {
          console.log("wait for connection...")
          waitForSocketConnection(socket, callback);
        }

      }, 5); // wait 5 milisecond for the connection...
  }
  const getFiles = async (files) => {
    setfilename(files.name)
    setMsg(files.base64)
  }
  const download = (base64Data, name, contentType = 'text/plain') => {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data.slice(base64Data.indexOf("base64,") + 7));
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    var blob = new Blob(byteArrays, { type: contentType })
    var url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  }
  return (
    <div className="App">
      {!connected ? <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> :
        <>
          <div>
            <FileBase64
              multiple={false}
              onDone={getFiles.bind(this)} />
            <input onClick={sendMessage} type='button' value='SEND' />
          </div>
          <div className='files'>{
            messages.map((msg, i) => {
              return <File key={i} msg={msg} filename={filename} download={download} user={user} />
            })
          }</div></>
      }
    </div>

  );
}

export default App;
