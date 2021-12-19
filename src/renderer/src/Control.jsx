import {peer, createOffer} from './control/peer-control.js'
const ipcRenderer = window.bridge.ipcRenderer
console.log(peer);
// const desktopCapturer = window.bridge.desktopCapturer
// console.log(peer)
// console.log(peer);
import React, { useEffect, useState } from 'react'
import './Control.css'
class Control extends React.Component {
  // constructor() {}
  componentDidMount() {
    console.log('control didmount');
    let video = document.getElementById('screen-video')

    peer.on('add-stream', stream => {
      console.log(stream);
      play(stream)
    })

    function play(stream) {
      video.srcObject = stream
      video.onloadedmetadata = function () {
        video.play()
      }
    }
    window.onkeydown = function(e){
      // let data = {}
      var data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey
      }
      peer.emit('robot','key', data)
    }
    window.onmouseup = function (e) {
      let data = {}
      data.clientX = e.clientX
      data.clientY = e.clientY
      data.video = {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height
      }
      peer.emit('robot', 'mouse', data)
    }
    createOffer().then(offer => {
      ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
    })
  }
  render() {
    return <video id="screen-video"></video>
  }
}
// async function Control() {
//   // const [video, setVideo] = useState({})
//   // useEffect(async () => {
//     const sources = await desktopCapturer.getSources({ types: ['screen'] })
//     navigator.webkitGetUserMedia(
//       {
//         audio: false,
//         video: {
//           mandatory: {
//             chromeMediaSource: 'desktop',
//             chromeMediaSourceId: sources[0].id,
//             maxWidth: window.screen.width,
//             maxHeight: window.screen.height,
//           },
//         },
//       },
//       (stream) => {
//         console.log(stream);
//         play(stream)
//       },
//       (err) => {
//         console.log(err)
//       }
//     )

//     let video = document.getElementById('screen-video')
//     function play(stream) {
//       video.srcObject = stream
//       video.onloadedmetadata = function () {
//         video.play()
//       }
//     }
//     // return () => {}
//   // }, [])
//   return <video id="screen-video"></video>
// }
export default Control
