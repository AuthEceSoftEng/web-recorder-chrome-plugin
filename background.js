var active = false;
var empty = true;
var screen = "start";
var test_seq = new Array();

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	console.log(req);
	if (req.action == "get_status") {
		sendResponse({'active': active, 'empty': empty, 'screen': screen});
	}
	
	if (req.action == "start") {
		if (!active) {
			active = true;
			empty = true;
			test_seq = new Array();
			sendResponse({start: true});
		}
	}
	
	if (req.action == "stop") {
		active = false;
		screen = "stop";
		sendResponse({});
	}
	
	if (req.action == "done") {
		active = false;
		screen = "done";
		sendResponse({});
	}
	
	if (req.action == "save") {
		active = false;
		screen = "save";
		sendResponse({});
	}
	
	if (req.action == "get_array") {
		sendResponse({'array': test_seq});
	}
	
});