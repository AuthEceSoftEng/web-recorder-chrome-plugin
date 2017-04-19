var active = false;
var empty = true;
var screen = "start";
var test_seq = [];

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	
	if (req.action == "get_status") {
		sendResponse({'active': active, 'empty': empty, 'screen': screen});
	}
	
	if (req.action == "append") {
		empty = false;
		test_seq.push(req.obj);
		console.log(test_seq);
	}
	
	if (req.action == "start") {
		if (!active) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "start"});
			});
		
			active = true;
			empty = true;
			test_seq = [];
			screen = "rec";
			sendResponse({start: true});
		}
	}
	
	if (req.action == "stop") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "stop"});
		});
		
		active = false;
		screen = "stop";
		sendResponse({});
	}
	
	if (req.action == "done") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "done"});
		});
		
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
