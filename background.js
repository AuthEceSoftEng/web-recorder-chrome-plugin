var active = false;
var empty = true;
var screen = "start";
var clicked = false;
var test_seq = [];
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	
	if (req.action == "get_status") {
		sendResponse({'active': active, 'empty': empty, 'screen': screen});
	}
	
	if (req.action == "append") {
		empty = false;
		if (JSON.stringify(test_seq[test_seq.length-1]) != JSON.stringify(req.obj))
			test_seq.push(req.obj);
		console.log(test_seq);
	}
	
	if (req.action == "start") {
		if (!active) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				for (var i = 0; i < tabs.length; i++) {
					chrome.tabs.sendMessage(tabs[i].id, {action: "start"});
				}
			});
		
			active = true;
			empty = true;
			clicked = false;
			test_seq = [];
			screen = "rec";
			sendResponse({start: true});
		}
	}
	
	if (req.action == "stop") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, {action: "stop", clicked: clicked});
			}
			clicked = true;
		});
		
		active = false;
		screen = "stop";
		sendResponse({});
	}
	
	if (req.action == "done") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, {action: "done", clicked: clicked});
			}
			clicked = true;
		});
		
		active = false;
		screen = "done";
		sendResponse({});
	}
	
	if (req.action == "save") {
		window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
			fs.root.getFile('log.txt', {create: true, exclusive: false}, function(fileEntry) {
				fileEntry.isFile === true;
				fileEntry.name == 'log.txt';
				fileEntry.fullPath == 'C:\log.txt';
			});
		});
		
		console.log(JSON.stringify(test_seq));
		
		active = false;
		clicked = false;
		screen = "save";
		sendResponse({});
	}
	
	if (req.action == "get_array") {
		sendResponse({'array': test_seq});
	}
	
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	chrome.tabs.executeScript(null, {file: "content.js"});
});


