const meetVersion = "0.1.1"
const CDNlink = `https://cdn.jsdelivr.net/gh/aiyashCreative/meet-snippet${meetVersion}/` //'http://localhost/creativehub/meet-source/' 
console.log(CDNlink);
const startingTime = new Date().getTime()
const jqueryScript = document.createElement('script')
const sweetAlert2Script = document.createElement('script')
const socketClientScript = document.createElement('script')
const watchScript = document.createElement('script')
const axiosScript = document.createElement('script')
const axiosLibrary = document.createElement('script')
const envScript = document.createElement('script')
const endPointScript = document.createElement('script')
const bootstrapBundleScript = document.createElement('script')
const videoSDKScript = document.createElement('script')
const bootstrapLink = document.createElement('link')
const fontAwesomeLink = document.createElement('link')

// stylesheet links
bootstrapLink.setAttribute('rel', "stylesheet")
bootstrapLink.setAttribute('href', "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css")
bootstrapLink.setAttribute('intergirty', "sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N")
bootstrapLink.setAttribute('crossorigin', "anonymous")

fontAwesomeLink.setAttribute('rel', "stylesheet")
fontAwesomeLink.setAttribute('href', "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
// scripts
jqueryScript.setAttribute('src', "https://code.jquery.com/jquery-3.6.4.min.js")
sweetAlert2Script.setAttribute('src', "https://cdn.jsdelivr.net/npm/sweetalert2@11")
socketClientScript.setAttribute('src', "https://cdn.socket.io/4.6.0/socket.io.min.js")
socketClientScript.setAttribute('crossorigin', "anonymous")
axiosScript.setAttribute('src', "https://unpkg.com/axios/dist/axios.min.js")
axiosLibrary.setAttribute('src', `${CDNlink}libraries/axios.js`)
envScript.setAttribute('src', `${CDNlink}constants/env.js`)
videoSDKScript.setAttribute('src', "https://sdk.videosdk.live/js-sdk/0.0.67/videosdk.js")
bootstrapBundleScript.setAttribute('src', "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js")
watchScript.setAttribute('src', `${CDNlink}libraries/watch.js`)

const socketUrl = "https://marketrix-soc.creative-hub.co/" // "http://192.168.1.76:8081"

// script tags
document.body.prepend(axiosScript)
document.body.prepend(sweetAlert2Script)
document.body.prepend(socketClientScript)
document.body.prepend(watchScript)
document.body.prepend(jqueryScript)
document.body.prepend(envScript)

// header link
document.head.prepend(bootstrapLink)
document.head.prepend(fontAwesomeLink)

const checkReady = (callback) => {
    if (window.jQuery) { callback(jQuery) }
    else window.setTimeout(function () { checkReady(callback); }, 20);
};

let socket
let startInterval

const meetingVariables = {
    id: "",
    token: "",
    name: "",
    userRole: "visitor",
    participant: {
        localId: "",
        remoteId: "",
    }
}

let video;

// initializing the library
checkReady(() => {
    // socket = io.connect(socketUrl)
    document.body.prepend(videoSDKScript)
    document.body.prepend(axiosLibrary)
    document.body.prepend(bootstrapBundleScript)
    listening()
    start()
})

// all watch would come inside this listening method
const listening = () => {
    // watch(() => {
    //     console.log('name is changing', name)
    // }, 'name')

    // watch(() => {
    //     if (meeting.meeting_id) meeting.start()
    //     else if (meeting.meeting_token) meeting.join.token()
    //     else if (meeting.guest_token) meeting.join.guest()
    // }, ['meeting.meeting_id', 'meeting.meeting_token', 'meeting.guest_token'])
}

const start = () => {
    const buttonDiv = document.createElement('div')
    const contactFormDiv = document.createElement('div')

    buttonDiv.setAttribute("id", "button-div")
    contactFormDiv.setAttribute("id", "contact-form-div")

    $("#button-div").css("position", "relative")
    document.body.prepend(contactFormDiv)
    document.body.prepend(buttonDiv)

    fetch(`${CDNlink}pages/contact-button.html`)
        .then((response) => {
            return response.text()
        })
        .then((html) => {
            buttonDiv.innerHTML = html
        });

    fetch(`${CDNlink}pages/contact-form.html`)
        .then((response) => {
            return response.text()
        })
        .then((html) => {
            contactFormDiv.innerHTML = html
        });

    getQuery()

    // meetingObj.connect() // testing purporses

    // mouse.startMove()
}

const closeModal = () => {
    // $(".modal").hide('slow')
    // show form and hide button
    $("#contact-form").hide('slow')
    $("#cover").hide('slow')
    $("#contact-button").show('slow')


}

const showModal = () => {
    // $(".modal").show('slow')
    // show button and hide form
    $("#contact-form").show('slow')
    $("#cover").show('slow')
    $("#contact-button").hide('slow')
}

const getQuery = () => {
    const url = window.location.href;
    const queryString = new URL(url).searchParams.get("marketrix-meet");

    if (queryString != null) {
        const decodedString = decodeURIComponent(queryString);

        // Parse the decoded string as a JavaScript object
        const decodedObject = JSON.parse(decodedString);
        console.log("decodedObject", decodedObject);

        if (decodedObject?.userRole === "admin") {
            connectUserToLive(decodedObject);

            meetingVariables.id = decodedObject.meetingId
            meetingVariables.token = decodedObject.token
            meetingVariables.name = decodedObject.userName
            meetingVariables.userRole = decodedObject.userRole
            console.log(meetingVariables)
            // return
            meetingObj.connect() // video sdk screen is starting
            $("#join-screen").css("display", "none") // have to hide the manually joining button for the admin
            setTimeout(() => {
                meetingObj.joinMeeting() // in one sec, admin is able to joining the meeting
            }, 1000)
        }
    }
}

const connectUserToLive = (meetInfo) => {
    console.log("meetInfo", meetInfo);
    socket = io.connect(socketUrl);
    socket.emit("userJoinLive", meetInfo);
};

const browserName = (function (agent) {
    switch (true) {
        case agent.indexOf("edge") > -1:
            return "MS Edge";
        case agent.indexOf("edg/") > -1:
            return "Edge ( chromium based)";
        case agent.indexOf("opr") > -1 && !!window.opr:
            return "Opera";
        case agent.indexOf("chrome") > -1 && !!window.chrome:
            return "Chrome";
        case agent.indexOf("trident") > -1:
            return "MS IE";
        case agent.indexOf("firefox") > -1:
            return "Mozilla Firefox";
        case agent.indexOf("safari") > -1:
            return "Safari";
        default:
            return "other";
    }
})(window.navigator.userAgent.toLowerCase());

const browserVersion = (function (agent) {
    switch (true) {
        case agent.indexOf("edge") > -1:
            return `${agent.split("edge")[1]}`;
        case agent.indexOf("edg/") > -1:
            return `${agent.split("edg/")[1]}`;
        case agent.indexOf("opr") > -1 && !!window.opr:
            return `${agent.split("opr/")[1]}`;
        case agent.indexOf("chrome") > -1 && !!window.chrome:
            return `${agent.split("chrome/")[1]}`;
        case agent.indexOf("trident") > -1:
            return `${agent.split("trident/")[1]}`;
        case agent.indexOf("firefox") > -1:
            return `${agent.split("firefox/")[1]}`;
        case agent.indexOf("safari") > -1:
            return `${agent.split("safari/")[1]}`;
        default:
            return "other";
    }
})(window.navigator.userAgent.toLowerCase());


const submit = async () => {
    socket = io.connect(socketUrl);

    const visitorDevice = {
        browser: navigator?.userAgentData?.brands[2]?.brand || browserName,
        browserVersion:
            navigator?.userAgentData?.brands[2]?.version || browserVersion,
        platform: navigator?.platform,
        networkDownlink: navigator?.connection?.downlink,
        networkEffectiveType: navigator?.connection?.effectiveType,
        vendor: navigator?.vendor,
        screenResolution: window?.screen?.width + "x" + window?.screen?.height,
        screenWidth: window?.screen?.width,
        screenHeight: window?.screen?.height,
    };

    const visitorPosition = await getCursorLocation(event);

    const visitor = {
        name: $("input[name='name']").val(),
        designation: "SE",
        email: $("input[name='email']").val(),
        company: "CreativeHub",
        phone_no: "0776068942",
        message: "I Need to talk to you Mr.Marketrix",
        website_domain: "http://localhost:3002/",
        visitorDevice: visitorDevice,
        visitorPosition: visitorPosition,
    };

    socket.emit("VisitorRequestMeet", visitor, (response) => {
        console.log(response); // ok

        if (!response.status) {
            alert(response.message + " ___ We will contact you soon through email");
            sentInquiryToDb(visitor)
        } else {
            socket.on("userResponseToVisitor", (data) => {
                console.log("userResponseToVisitor...", data);
                meetingVariables.id = data.meetingId
                meetingVariables.token = data.token
                meetingVariables.name = data.visitor.name

                socket.on("connectedUsers", (data) => {
                    console.log("connectedUsers...", data);
                    const meetingId = meetingVariables.id

                    const index = data.findIndex(d => d.meetingId === meetingId && d.userRole === "admin")
                    console.log('admin data', data[index])
                    const adminCursor = data[index].cursor
                    const x = adminCursor.x
                    const y = adminCursor.y
                    $("#admin-mouse-position").css("left", x);
                    $("#admin-mouse-position").css("top", y);
                });

                if (data) meetingObj.connect(); closeModal(); //mouse.startMove(); //openCam()
            });
        }
    });
}

const getCursorLocation = async (event) => {
    const { clientX, clientY } = event;
    let x = clientX;
    let y = clientY;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    return { x, y, windowWidth, windowHeight };
};

const meetingObj = {
    meeting: null,
    isMicOn: false,
    isWebCamOn: false,
    connect() {
        const videoConfigDiv = document.createElement('div')
        videoConfigDiv.setAttribute('id', 'video-sdk-config')
        document.body.prepend(videoConfigDiv)

        fetch(`${CDNlink}pages/configuration.html`)
            .then((response) => {
                return response.text()
            })
            .then((html) => {
                videoConfigDiv.innerHTML = html
            });
    },

    initializeMeeting: () => {
        window.VideoSDK.config(meetingVariables.token);

        meetingObj.meeting = window.VideoSDK.initMeeting({
            meetingId: meetingVariables.id, // required
            name: meetingVariables.name, // required
            micEnabled: true, // optional, default: true
            webcamEnabled: true, // optional, default: true
        });

        meetingObj.meeting.join();

        // Creating local participant
        meetingObj.createLocalParticipant();

        // Setting local participant stream
        meetingObj.meeting.localParticipant.on("stream-enabled", (stream) => {
            meetingObj.setTrack(stream, null, meetingObj.meeting.localParticipant, true);
        });

        // meeting joined event
        meetingObj.meeting.on("meeting-joined", () => {
            $("#textDiv").css("display", "block")
            $("#grid-screen").css("display", "block")
            $("#meetingIdHeading").text(`Meeting Id: ${meetingVariables.id}`)
        });

        // meeting left event
        meetingObj.meeting.on("meeting-left", () => {
            $("#videoContainer").text("")
        });

        // Remote participants Event
        // participant joined
        meetingObj.meeting.on("participant-joined", (participant) => {
            let videoElement = meetingObj.createVideoElement(
                participant.id,
                participant.displayName
            );
            meetingVariables.participant.remoteId = participant.id
            let audioElement = meetingObj.createAudioElement(participant.id);
            // stream-enabled
            participant.on("stream-enabled", (stream) => {
                meetingObj.setTrack(stream, audioElement, participant, false);
            });
            $("#videoContainer").append(videoElement);
            $("#videoContainer").append(audioElement);
        });

        // participants left
        meetingObj.meeting.on("participant-left", (participant) => {
            let vElement = document.getElementById(`f-${participant.id}`);
            vElement.remove(vElement);

            let aElement = document.getElementById(`a-${participant.id}`);
            aElement.remove(aElement);
        });
    },

    createLocalParticipant: () => {
        let localParticipant = meetingObj.createVideoElement(
            meetingObj.meeting.localParticipant.id,
            meetingObj.meeting.localParticipant.displayName
        );
        meetingVariables.participant.localId = meetingObj.meeting.localParticipant.id
        let localAudioElement = meetingObj.createAudioElement(meetingObj.meeting.localParticipant.id);
        $("#videoContainer").append(localParticipant);
        $("#videoContainer").append(localAudioElement);
    },

    setTrack: (stream, audioElement, participant, isLocal) => {
        if (stream.kind == "video") {
            meetingObj.isWebCamOn = true;
            const mediaStream = new MediaStream();
            mediaStream.addTrack(stream.track);
            let videoElm = document.getElementById(`v-${participant.id}`)
            videoElm.srcObject = mediaStream;
            videoElm
                .play()
                .catch((error) =>
                    console.error("videoElem.current.play() failed", error)
                );
        }
        if (stream.kind == "audio") {
            if (isLocal) {
                isMicOn = true;
            } else {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(stream.track);
                audioElement.srcObject = mediaStream;
                audioElement
                    .play()
                    .catch((error) => console.error("audioElem.play() failed", error));
            }
        }
    },

    createVideoElement: (pId, name) => {
        let videoFrame = document.createElement("div");
        videoFrame.setAttribute("id", `f-${pId}`);

        //create video
        let videoElement = document.createElement("video");
        videoElement.classList.add("video-frame");
        videoElement.setAttribute("id", `v-${pId}`);
        // videoElement.classList.add(`v-${pId}`);
        videoElement.setAttribute("playsinline", true);
        videoElement.setAttribute("width", "300");
        // videoElement.style.marginTop = "-165px"
        videoFrame.appendChild(videoElement);

        let displayName = document.createElement("div");
        displayName.innerHTML = `Name : ${name}`;

        videoFrame.appendChild(displayName);
        return videoFrame;
    },

    createAudioElement: (pId) => {
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("autoPlay", "false");
        audioElement.setAttribute("playsInline", "true");
        audioElement.setAttribute("controls", "false");
        audioElement.setAttribute("id", `a-${pId}`);
        audioElement.style.display = "none";
        return audioElement;
    },

    joinMeeting: () => {
        $("#join-screen").css("display", "none")
        $("#textdiv").text("Joining the meeting...")
        $("#configuration-cover").css("display", "block")
        mouse.hide()
        // meetingVariables.id = roomId;

        meetingObj.initializeMeeting();
    },

    leaveMeeting: () => {
        meetingObj.meeting?.leave();
        $("#grid-screen").css("display", "none")
        $("#join-screen").css("display", "block")
    },

    toggle: {
        mic: () => {
            if (meetingObj.isMicOn) {
                // Disable Mic in Meeting
                meetingObj.meeting?.muteMic();
            } else {
                // Enable Mic in Meeting
                meetingObj.meeting?.unmuteMic();
            }
            meetingObj.isMicOn = !meetingObj.isMicOn;
        },

        webCam: () => {
            meetingObj.meeting?.disableWebcam();

            if (meetingObj.isWebCamOn)
                $(`#f-${meetingObj.meeting.localParticipant.id}`).css("display", "none")
            else {
                meetingObj.meeting?.enableWebcam();

                $(`#f-${meetingObj.meeting.localParticipant.id}`).css("display", "inline")
            }
            meetingObj.isWebCamOn = !meetingObj.isWebCamOn;
        }
    }
}

const sentInquiryToDb = (data) => {
    let currentUrl = window.location.hostname;

    let inquiry = {
        name: data.name,
        designation: data.designation,
        company: data.company,
        email: data.email,
        phone_no: data.phone,
        message: data.message,
        inquiry_type: data.inquiryType,
        inquiry_status: "requested",
        website_domain: currentUrl,
    };



    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
    };

    console.log("send inquiery details")

    // fetch(`${serverBaseUrl}meet-live/inquiries/create`, requestOptions)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log("data", data);
    //     });
}

const mouse = {
    startMove: () => {
        document.onmousemove = mouse.handleMouse
    },
    show: () => {
        $(".mouse").show()
        $("#configuration-cover").hide()
        // $("#configuration").css({'z-index':0})
        $("#controls").hide()
        $("rejoin").show()
        mouse.startMove()
        console.log("local participant id", meetingVariables.participant.localId)
        console.log("remote participant id", meetingVariables.participant.remoteId)

        // make video movable
        const localId = meetingVariables.participant.localId
        const remoteId = meetingVariables.participant.remoteId
        if (localId) {
            $(`#f-${localId}`).css("position", "absolute")
            // $(`#v-${localId}`).css("z-index", 6)
        }
        if (remoteId) $(`#f-${remoteId}`).css("position", "absolute")
    },
    hide: () => {
        $(".mouse").hide()
        $("#configuration-cover").show()
        // $("#configuration").css({'z-index':6})
        $("rejoin").hide()
        $("#controls").show()
        const localId = meetingVariables.participant.localId
        const remoteId = meetingVariables.participant.remoteId

        if (localId) $(`#f-${localId}`).css("position", "none")
        if (remoteId) $(`#f-${remoteId}`).css("position", "none")
    },
    handleMouse: (event) => {
        let x = event.clientX;
        let y = event.clientY;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let cursor = {
            x: x,
            y: y,
            windowWidth: windowWidth,
            windowHeight: windowHeight,
        };

        const localId = meetingVariables.participant.localId
        const remoteId = meetingVariables.participant.remoteId

        if (localId) {
            $(`#f-${localId}`).css("left", x)
            $(`#f-${localId}`).css("top", y)
        }

        socket.emit("cursorPosition", cursor, (response) => {
            // console.log("cursorPosition-send", response); // ok
            const localUserRole = meetingVariables.userRole
            console.log("local user role", localUserRole)
            const index = response.findIndex(r => r.userRole !== localUserRole)
            const cursor = response[index].cursor
            console.log(cursor, response[index].userRole, localUserRole)

            if (remoteId) {
                console.log("coming", remoteId)
                $(`#f-${remoteId}`).css("left", cursor.x)
                $(`#f-${remoteId}`).css("top", cursor.y)
            }
        });
    }

}

const openCam = () => {
    let All_mediaDevices = navigator.mediaDevices
    if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }
    All_mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(function (vidStream) {
            video = document.getElementById('videoCam');
            if ("srcObject" in video) {
                video.srcObject = vidStream;
            } else {
                video.src = window.URL.createObjectURL(vidStream);
            }
            video.onloadedmetadata = function (e) {
                video.play();
                mouse.startMove()
            };

        })
        .catch(function (e) {
            console.log(e.name + ": " + e.message);
        });
}