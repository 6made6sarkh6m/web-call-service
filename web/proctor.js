var SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
var STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;

function init_page() {
    //init api
    try {
        Flashphoner.init({flashMediaProviderSwfLocation: 'lib/media-provider.swf'});
    } catch(e) {
        $("#notifyFlash").text("Your browser doesn't support Flash or WebRTC technology necessary for work of an example");
        return;
    }

    //$("#url").val(setURL());
    $("#url").val("wss://rtc.uib.kz:8443");
	$('streamName1').val("strcamera");
	$('streamName2').val("strScreen");
    onDisconnected();
    
	onStopped(1);
    onStopped(2);
	setFunc(1);
	setFunc(2);

}

function connect() {
    var url = $('#url').val();
    //create session
    console.log("Create new session with url " + url);
    Flashphoner.createSession({urlServer: url}).on(SESSION_STATUS.ESTABLISHED, function(session){
        setStatus("#connectStatus", session.status());
        onConnected(session)
    }).on(SESSION_STATUS.DISCONNECTED, function(){
        setStatus("#connectStatus", SESSION_STATUS.DISCONNECTED);
        onDisconnected();
    }).on(SESSION_STATUS.FAILED, function(){
        setStatus("#connectStatus", SESSION_STATUS.FAILED);
        onDisconnected();
    });
}

function onConnected(session) {
    $("#connectBtn").text("Disconnect").off('click').click(function(){
        $(this).prop('disabled', true);
        session.disconnect();
    }).prop('disabled', false);
    onStopped(1);
    onStopped(2);
}

function onDisconnected() {
    $("#connectBtn").text("Connect").off('click').click(function(){
        if (validateForm("connectionForm")) {
            $('#url').prop('disabled', true);
            $(this).prop('disabled', true);
            connect();
        }
    }).prop('disabled', false);
    $('#url').prop('disabled', false);
    onStopped(1);
    onStopped(2);
}

function playStream(index) {
    var session = Flashphoner.getSessions()[0];
    var streamName = $('#streamName' + index).val();
    var display = document.getElementById("player" + index);

    if (Flashphoner.getMediaProviders()[0] === "WSPlayer") {
        Flashphoner.playFirstSound();
    } else if (Browser.isSafariWebRTC()) {
        Flashphoner.playFirstVideo(display, false);
    }

    session.createStream({
        name: streamName,
        display: display
    }).on(STREAM_STATUS.PENDING, function(stream) {
        var video = document.getElementById(stream.id());
        if (!video.hasListeners) {
            video.hasListeners = true;
            video.addEventListener('resize', function (event) {
                resizeVideo(event.target);
            });
        }
    }).on(STREAM_STATUS.PLAYING, function(stream) {
        setStatus("#status" + index, stream.status());
        onPlaying(index, stream);
    }).on(STREAM_STATUS.STOPPED, function() {
        setStatus("#status" + index, STREAM_STATUS.STOPPED);
        onStopped(index);
    }).on(STREAM_STATUS.FAILED, function() {
        setStatus("#status" + index, STREAM_STATUS.FAILED);
        onStopped(index);
    }).play();
}

function onPlaying(index, stream) {
    $("#playBtn" + index).text("Stop").off('click').click(function(){
        $(this).prop('disabled', true);
		$("#snapshotBtn" + index).prop('disabled', true);
		// $("#snapshotBtn" + index).prop('disabled', false);
        stream.stop();
    }).prop('disabled', false);
}

function onStopped(index) {
    $("#playBtn" + index).text("Play").off('click').click(function(){
        if (validateForm("form" + index)) {
            $('#streamName' + index).prop('disabled', true);
			$("#snapshotBtn" + index).prop('disabled', false);
			// $("#snapshotBtn" + index).prop('disabled', true);
            $(this).prop('disabled', true);
            playStream(index);
        }
    });
    if (Flashphoner.getSessions()[0] && Flashphoner.getSessions()[0].status() == SESSION_STATUS.ESTABLISHED) {
        $("#playBtn" + index).prop('disabled', false);
        $("#snapshotBtn" + index).prop('disabled', true);
        // $("#snapshotBtn" + index).prop('disabled', false);
        $('#streamName' + index).prop('disabled', false);
    } else {
        $("#playBtn" + index).prop('disabled', true);
        $("#snapshotBtn" + index).prop('disabled', true);
        // $("#snapshotBtn" + index).prop('disabled', false);
        $('#streamName' + index).prop('disabled', true);
    }
}


function setFunc(index) {
	$('#snapshotBtn' + index).click(function(){
		var streamName = $('#streamName' + index).val();
		console.log("Click button: " + index+" Stream:"+streamName);
		
		snapshot(streamName,index);
		
		
	})
}

async function saveSnapshot(strname,img){
	
	console.log("Snapshot save");
	console.log(img);
	var streamName = strname;
	var url ='http://localhost:8080/snapshot/add?strname='+streamName+'&imgb64='+img;
	
	let response  = await fetch(url);
	let text = await response.text()
	console.log(text);
	
}

async function saveSnapshotPost(sname,img){
	
	console.log("Snapshot save");
	// console.log(img);
	let snapshotimg = {
		strname: sname,
		imgb64: img
		};
	var url ='https://rtc.uib.kz:8183/savesnapshotservice/snapshot/save';
	
	let response  = await fetch(url,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			
		},
		body: JSON.stringify(snapshotimg)
	
	});
	let text = await response.text()
	alert(text);
	
}

function snapshot(name, index) {
	snapshotImg  = document.getElementById("dynImg"+index);
	snapshotlink  = document.getElementById("link"+index);
	dt = new Date();
	day = dt.getDate()> 10 ? dt.getDate() : '0' + dt.getDate();
	month = dt.getMonth()> 9 ? dt.getMonth()+1 : '0' + (dt.getMonth()+1);
	hr = dt.getHours()> 10 ? dt.getHours() : '0' + dt.getHours();
	mints = dt.getMinutes()> 10 ? dt.getMinutes() : '0' + dt.getMinutes();
	sec = dt.getSeconds()> 10 ? dt.getSeconds() : '0' + dt.getSeconds();
	filename = name+day+"."+month+"."+dt.getFullYear()+"_"+hr+"-"+mints+"-"+sec+".png";
    var session = Flashphoner.getSessions()[0];
    session.createStream({name: name}).on(STREAM_STATUS.SNAPSHOT_COMPLETE, function(stream){
        console.log("Snapshot complete"+dt);
		saveSnapshotPost(name, stream.getInfo())
        stream.on(STREAM_STATUS.FAILED, function(){});
        //release stream object
        stream.stop();
    }).on(STREAM_STATUS.FAILED, function(stream){
        console.log("Snapshot failed, info: " + stream.getInfo());
    }).snapshot();
}

//show connection or remote stream status
function setStatus(selector, status) {
    var statusField = $(selector);
    statusField.text(status).removeClass();
    if (status == "PLAYING" || status == "ESTABLISHED") {
        statusField.attr("class","text-success");
    } else if (status == "DISCONNECTED" || status == "STOPPED") {
        statusField.attr("class","text-muted");
    } else if (status == "FAILED") {
        statusField.attr("class","text-danger");
    }
}

function validateForm(formId) {
    var valid = true;
    $('#' + formId + ' :text').each(function(){
        if (!$(this).val()) {
            highlightInput($(this));
            valid = false;
        } else {
            removeHighlight($(this));
        }
    });
    return valid;

    function highlightInput(input) {
        input.closest('.input-group').addClass("has-error");
    }
    function removeHighlight(input) {
        input.closest('.input-group').removeClass("has-error");
    }
}
