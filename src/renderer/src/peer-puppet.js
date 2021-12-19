const pc = new window.RTCPeerConnection({})
const desktopCapturer = window.bridge.desktopCapturer
const ipcRenderer = window.bridge.ipcRenderer
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return new Promise((resolve, reject) => {
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[0].id,
            maxWidth: window.screen.width,
            maxHeight: window.screen.height,
          },
        },
      },
      (stream) => {
        console.log(stream)
        // peer.emit('add-stream', stream)
        resolve(stream)
      },
      (err) => {
        // console.log(err);
        reject(err)
      }
    )
  })
}

pc.ondatachannel = (e) => {
  console.log('datachannel', e)
  e.channel.onmessage = (e) => {
    let { type, data } = JSON.parse(e.data)
    if (type === 'mouse') {
      data.screen = {
        width: window.screen.width,
        height: window.screen.height,
      }
    }
    ipcRenderer.send('robot', type, data)
  }
}

pc.onicecandidate = function (e) {
  console.log('conditate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('forward', 'puppet-candidate', JSON.stringify(e.candidate))
  }
}
ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})
let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(JSON.parse(candidate))
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
  }
}

ipcRenderer.on('offer', async (e, offer) => {
  const answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp })
})
async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log('answer', JSON.stringify(pc.localDescription))
  return pc.localDescription
}

window.createAnswer = createAnswer
