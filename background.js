var active = false;
var empty = true;
var clicked = false;
var test_seq = [];

if (localStorage.getItem('currentUser'))
	screen = 'start';
else
	screen = 'login';

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	
	if (req.action == "get_status") {
		sendResponse({'active': active, 'empty': empty, 'screen': screen});
	}
	
	if (req.action == "append") {
		empty = false;
		if (JSON.stringify(test_seq[test_seq.length-1]) != JSON.stringify(req.obj)) {
			test_seq.push(req.obj);
			console.log(JSON.stringify(test_seq[test_seq.length-1]));
		}
	}
	
	if (req.action == "login") {
		var state;
		
		$.ajax({
			async: false,
			type: 'POST',
			url: 'http://localhost:4000/users/authenticate',
			data: {
				email: req.email,
				password: req.password
			},
			success: function(response) {
				localStorage.setItem('currentUser', JSON.stringify(response));
				state = true;
			},
			error: function() {
				state = false;
			}
		});
			
		if (state) {
			screen = "start";
			sendResponse({login: true});
		}
		else {
			screen = "login";
			sendResponse({login: false});
		}
		
		active = false;
	}
	
	if (req.action == "logout") {
		localStorage.removeItem('currentUser');
		screen = "login";
		active = false;
		sendResponse({});
	}
	
	if (localStorage.getItem('currentUser')) {
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
			var state;
			var user = JSON.parse(localStorage.getItem('currentUser'));
			
			$.ajax({
				async: false,
				type: 'POST',
				headers: {
					'Authorization': 'Bearer ' + user.token
				},
				url: 'http://localhost:4000/users/' + user._id + '/tests',
				data: {
					_id: user._id,
					test_name: req.testName,
					suite_name: req.suiteName,
					test_obj: JSON.stringify(test_seq)
				},
				success: function(response) {
					state = true;
				},
				error: function() {
					state = false;
				}
			});
				
			active = false;
			clicked = false;
			screen = "save";
			console.log(JSON.stringify(test_seq));
			sendResponse({});
		}
	
		if (req.action == "get_array") {
			sendResponse({'array': test_seq});
		}
	}
	else {
		screen = "login";
		active = false;
		sendResponse({});
	}
	
});

/*chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	chrome.tabs.executeScript(null, {file: "content.js"});
});*/

