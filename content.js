function startRecorder() {
	var anchors = $("a");
	var areas = $("area");
	var buttons = $("button");
	var forms = $("form");
	var inputs = $("input");
	var menus = $("menu");
	var menuItems = $("menuitem");
	var options = $("option");
	var selects = $("select");
	var textareas = $("textarea");
	var URL = window.location.href;
	
	console.log("Recorder started");
	console.log(anchors);
	console.log(areas);
	console.log(buttons);
	console.log(forms);
	console.log(inputs);
	console.log(menus);
	console.log(menuItems);
	console.log(options);
	console.log(selects);
	console.log(textareas);
	console.log(URL);
	
	/*$(document).click(function() {
		var val = identify(event.target);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	$(document).change(function() {
		var val = identify(event.target);
		
		sendMsg("change", val[0], val[1], event.target.value);
	});*/
	
	anchors.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	areas.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	buttons.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	forms.submit(function() {
		var val = identify(this);
		
		sendMsg("submit", val[0], val[1], "");
	});
	
	inputs.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	inputs.change(function() {
		var val = identify(this);
		
		sendMsg("change", val[0], val[1], this.value);
		
		$(document).keypress(function() {
			if (event.which == 13) {
				var val = identify(event.target);
			
				sendMsg("enterKey", val[0], val[1], "");
			}
		});
	
	});

	selects.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	selects.change(function() {
		var val = identify(this);
		
		sendMsg("change", val[0], val[1], this.value);
	});
	
	textareas.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	textareas.change(function() {
		var val = identify(this);
		
		sendMsg("change", val[0], val[1], this.value);
	});
	
}

function identify(e) {
	var type, identifier;
	
	if (e.id != "") {
		identifier = e.id;
		type = "id";
	}
	else if (e.name != "") {
		identifier = e.name;
		type = "name";
	}
	else if (e.href != undefined) {
		if (e.href != "") {
			identifier = e.href;
			type = "linkText";
		}
	}
	else if (e.className != "") {
		identifier = e.className;
		type = "className";
	}
	
	return [type, identifier];
}

function sendMsg(type, identifier, id_value, input_value) {
	chrome.runtime.sendMessage({action: "append", obj: {type: type, identifier: identifier, id: id_value, input: input_value}});
}

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	if (req.action == "start") {
		startRecorder();
	}
	
	if (req.action == "stop"  || req.action == "done") {
		location.reload();
	}
	
});

chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    if (response.active) {
        startRecorder();
    }
});
