

const APP_ID = '1da13b98752547969aa76946e0bece7d'
const CHANNEL = sessionStorage.getItem('roomId')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('UID');

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localTracks = []
let remoteUsers = {}
let screenTracks = []



let isSharingEnabled = false

let joinAndDisplayLocalStreams = async ()=>{

    client.on("user-published",handleUserJoined)
    client.on("user-left",handleUserLeft)


    await client.join(APP_ID, CHANNEL, TOKEN, UID)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper"><span class="user-name">My Name:</span></div>
                <div class="video-player" id="user-${UID}"></div>
                </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0],localTracks[1]])
}

let handleUserJoined = async (user,mediaType) => {
    remoteUsers[user.uid]=user
    await client.subscribe(user,mediaType)

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player!=null) {
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper"><span class="user-name">My Name:</span></div>
                <div class="video-player" id="user-${user.uid}"></div>
                </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType==='audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () =>{
    for (let i=0; i<localTracks.length; i++){
        localTracks[i].stop();
        localTracks[i].close();
    }

    await client.leave()

    window.open('/','_self')

}

let toggleCamera = async () =>{
    if(localTracks[1].muted){
        
        await localTracks[1].setMuted(false)
    }else{
        document.getElementById('video').children[0].remove()
        await localTracks[1].setMuted(true)
    }
}

let toggleMicrophone = async () =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
    }else{
        await localTracks[0].setMuted(true)
    }
}

let toggleScreen = async () =>{
    if(isSharingEnabled){    
        screenTracks = await AgoraRTC.createScreenVideoTrack()

        user.videoTrack.replaceTrack(screenTracks,true)

        isSharingEnabled = true
    }else{
        user.videoTrack.replaceTrack(localTracks[1],true)

        isSharingEnabled = false
    }
}

document.getElementById('leave').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('video').addEventListener('click',toggleCamera)
document.getElementById('audio').addEventListener('click',toggleMicrophone)
document.getElementById('share').addEventListener('click',toggleScreen)

joinAndDisplayLocalStreams()


