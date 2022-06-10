(function (window, undefined) {
  window.SCMS = window.SCMS || {};
  SCMS.recordAudio = recordAudio;
  SCMS.recordVideo = recordVideo;
  SCMS.recordScreen = recordScreen;
  SCMS.closeModal = () => {
    SCMS._appreciateModal.style.display = "none";
    SCMS._issueLoggerModal.style.display = "none";
  };
  SCMS.openMailAppreciate = function () {
    SCMS._appreciateModal.style.display = "block";
  };
  SCMS.openMailIssueLogger = function () {
    SCMS._issueLoggerModal.style.display = "block";
  };
  let event = {
    onStartRecording: new Event("onStartRecording"),
    onStopRecording: new Event("onStopRecording"),
  };
  let shouldStop = false;
  let stopped = false;
  let SCMSInit = (
    config = {
      shortCutKeys: {
        screen: "s",
        audio: "a",
        video: "v",
        end: "e",
        appreciate: "z",
        end: "x",
      },
      mailAppreciateConfig: {
        to: "users@accionlabs.com",
        cc: "manager@accionlabs.com",
        subject: "We are Happy About this feature!",
        body: "Thanks a lot",
      },
      mailIssueLoggerConfig: {
        to: "esculation@accionlabs.com",
        cc: "manager@accionlabs.com",
        subject: "Can Someone Look into this ?",
        body: "Urgent fix required",
      },
    }
  ) => {
    let recorderHTML =
      "" +
      '<div style="display:none">' +
      '    <span><a id="SCMS_download" ><button type="button"> Download</button></a></span>' +
      '    <button type="button" id="stop" disabled>Stop</button>' +
      '    <button type="button" onclick="window.SCMS.recordAudio()">Record Audio</button>' +
      '    <button type="button" onclick="window.SCMS.recordVideo()">Record Video</button>' +
      '    <button type="button" onclick="window.SCMS.recordScreen()">Record Screen</button>' +
      "    <div>" +
      "        <video autoplay height='480' width=\"640\" muted></video>" +
      "    </div>" +
      "    </div>" +
      "";
    let modalHTML =
      "" +
      '<div id="apprModal" class="SCMS_modal">' +
      "" +
      "  <!-- Modal content -->" +
      '  <div class="modal-content">' +
      '    <span class="titleFont">Feedback Appreciation Composer</span><span class="close" onclick="SCMS.closeModal()">&times;</span>' +
      `    <div class="displayFlex row mt45"><span class="basis20px">To</span><span class="flex1"><input class="w80 inputBox" value="${config.mailAppreciateConfig.to}" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">CC</span><span class="flex1"><input  value="${config.mailAppreciateConfig.cc}" class="w80 inputBox" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">Subject</span><span class="flex1"><input class="w80 inputBox" value="${config.mailAppreciateConfig.subject}" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">Body</span><span class="flex1"><textarea class="w80 inputArea" >${config.mailAppreciateConfig.body}</textarea></span></div>` +
      '	<div class="displayFlex row"><span class="basis20px"><input type="file" /></span><span class="btnContainer"></span></div>' +
      '	<div class="displayFlex row"><span class="basis20px"></span><span class="btnContainer"><input class="inputBtn" type="button" value="Send" /></span></div>' +
      "  </div>" +
      "" +
      "</div>" +
      "";
    let modalIssueLoggerHTML =
      "" +
      '<div id="SCMSIssueModal" class="SCMS_modal">' +
      "" +
      "  <!-- Modal content -->" +
      '  <div class="modal-content">' +
      '    <span class="titleFont">Feedback Issue composer</span><span class="close" onclick="SCMS.closeModal()">&times;</span>' +
      `    <div class="displayFlex row mt45"><span class="basis20px">To</span><span class="flex1"><input class="w80 inputBox" value="${config.mailIssueLoggerConfig.to}" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">CC</span><span class="flex1"><input  value="${config.mailIssueLoggerConfig.cc}" class="w80 inputBox" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">Subject</span><span class="flex1"><input class="w80 inputBox" value="${config.mailIssueLoggerConfig.subject}" /></span></div>` +
      `	<div class="displayFlex row"><span class="basis20px">Body</span><span class="flex1"><textarea class="w80 inputArea" >${config.mailIssueLoggerConfig.body}</textarea></span></div>` +
      '	<div class="displayFlex row"><span class="basis20px"><input type="file" /></span><span class="btnContainer"></span></div>' +
      '	<div class="displayFlex row"><span class="basis20px"></span><span class="btnContainer"><input class="inputBtn" type="button" value="Send" /></span></div>' +
      "  </div>" +
      "" +
      "</div>" +
      "";
    var spanSCMS = document.createElement("span");
    document.body.appendChild(spanSCMS);
    spanSCMS.innerHTML = recorderHTML + modalHTML + modalIssueLoggerHTML;

    // define a handler
    function doc_keyUp(e) {
      // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.audio
      ) {
        SCMS.recordAudio();
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.video
      ) {
        SCMS.recordVideo();
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.screen
      ) {
        SCMS.recordScreen();
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.appreciate
      ) {
        SCMS.openMailAppreciate();
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.issue
      ) {
        SCMS.openMailIssueLogger();
      }

      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === config.shortCutKeys.end
      ) {
        shouldStop = true;
        stopRecord();
      }
    }

    // register the handler
    document.addEventListener("keyup", doc_keyUp, false);

    // Get the modal
    SCMS._appreciateModal = document.getElementById("apprModal");
    SCMS._issueLoggerModal = document.getElementById("SCMSIssueModal");
    SCMS._videoElement = document.getElementsByTagName("video")[0];
  };
  let startRecord = () => {
    document
      .getElementsByTagName("body")[0]
      .dispatchEvent(event.onStartRecording);
  };
  let stopRecord = () => {
    document
      .getElementsByTagName("body")[0]
      .dispatchEvent(event.onStopRecording);
  };
  let audioRecordConstraints = {
    echoCancellation: true,
  };
  let handleRecord = function ({ stream, mimeType }) {
    startRecord();
    let recordedChunks = [];
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);
    function stopStream(stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if (shouldStop === true && stopped === false) {
        setTimeout(() => stopStream(SCMS._videoElement.srcObject), 5000);
        mediaRecorder.stop();
        stopped = true;
        setTimeout(function () {
          document.getElementById("SCMS_download").click();
        }, 2000);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType,
      });
      recordedChunks = [];
      const filename = window.prompt("Enter file name");
      downloadLink = document.getElementById("SCMS_download");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${filename || "recording"}.webm`;
      stopRecord();
      // SCMS._videoElement.srcObject = null;
    };

    mediaRecorder.start(200);
  };
  async function recordAudio() {
    const mimeType = "audio/webm";
    shouldStop = false;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioRecordConstraints,
    });
    handleRecord({ stream, mimeType });
  }
  async function recordVideo() {
    const mimeType = "video/webm";
    shouldStop = false;
    const constraints = {
      audio: {
        echoCancellation: true,
      },
      video: {
        width: {
          min: 640,
          max: 1024,
        },
        height: {
          min: 480,
          max: 768,
        },
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    SCMS._videoElement.srcObject = stream;
    handleRecord({ stream, mimeType });
  }
  async function recordScreen() {
    const mimeType = "video/webm";
    shouldStop = false;
    const constraints = {
      video: {
        cursor: "motion",
      },
    };
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
      return window.alert("Screen Record not supported!");
    }
    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: "motion" },
      audio: { echoCancellation: true },
    });
    if (window.confirm("Record audio with screen?")) {
      const audioContext = new AudioContext();

      const voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true },
        video: false,
      });
      const userAudio = audioContext.createMediaStreamSource(voiceStream);

      const audioDestination = audioContext.createMediaStreamDestination();
      userAudio.connect(audioDestination);

      if (displayStream.getAudioTracks().length > 0) {
        const displayAudio =
          audioContext.createMediaStreamSource(displayStream);
        displayAudio.connect(audioDestination);
      }

      const tracks = [
        ...displayStream.getVideoTracks(),
        ...audioDestination.stream.getTracks(),
      ];
      stream = new MediaStream(tracks);
      handleRecord({ stream, mimeType });
    } else {
      stream = displayStream;
      handleRecord({ stream, mimeType });
    }
    SCMS._videoElement.srcObject = stream;
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (
      event.target == SCMS._appreciateModal ||
      event.target == SCMS._issueLoggerModal
    ) {
      SCMS.closeModal();
    }
  };
  SCMS.init = SCMSInit;
})(window);
