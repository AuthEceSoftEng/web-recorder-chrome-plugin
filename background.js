var active = false;
var empty = true;
var clicked = false;
var asserting = false;
var test_seq = [];
var serverURL = 'http://snf-750380.vm.okeanos.grnet.gr:4000/';

if (localStorage.getItem('currentUser'))
	screen = 'start';
else
	screen = 'login';

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	
	if (req.action == "get_status") {
		sendResponse({'active': active, 'empty': empty, 'screen': screen, 'assertions': asserting});
	}
	
	if (req.action == "append") {
		empty = false;
		//console.log(JSON.stringify(req.obj));
		if (JSON.stringify(test_seq[test_seq.length-1]) != JSON.stringify(req.obj) && asserting == false) {
			test_seq.push(req.obj);
			console.log(JSON.stringify(test_seq[test_seq.length-1]));
		}
	}
	
	if (req.action == "append_assertion") {
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
			url: serverURL + 'authenticate',
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
				asserting = false;
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
			asserting = false;
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
			asserting = false;
			screen = "done";
			sendResponse({});
		}
		
		if (req.action == "operations") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				for (var i = 0; i < tabs.length; i++) {
					chrome.tabs.sendMessage(tabs[i].id, {action: "operations"});
				}
			});
			
			asserting = false;
			sendResponse({});
		}
		
		if (req.action == "assertions") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				for (var i = 0; i < tabs.length; i++) {
					chrome.tabs.sendMessage(tabs[i].id, {action: "assertions"});
				}
			});
			
			asserting = true;
			sendResponse({});
		}
	
		if (req.action == "save") {
			if (req.testName != "" && req.suiteName != "") {
				var state;
				var user = JSON.parse(localStorage.getItem('currentUser'));
			
				$.ajax({
					async: false,
					type: 'POST',
					headers: {
						'Authorization': 'Bearer ' + user.token
					},
					url: serverURL + user._id + '/tests',
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
			
				if (state) {
					screen = "start";
					sendResponse({save: true});
				} else {
					screen = "save-error";
					sendResponse({save: false});
				}
				
				active = false;
				clicked = false;
				console.log(JSON.stringify(test_seq));
			}
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

