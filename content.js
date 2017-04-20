function startRecorder() {
	var anchors = $("a");
	var areas = $("area");
	var buttons = $("button");
	var forms = $("form");
	var images = $("img");
	var inputs = $("input");
	var menus = $("menu");
	var menuItems = $("menuitem");
	var options = $("option");
	var optgroups = $("optgroup");
	var selects = $("select");
	var textareas = $("textarea");
	var URL = window.location.href;
	
	console.log("Recorder started");
	console.log(anchors);
	console.log(areas);
	console.log(buttons);
	console.log(forms);
	console.log(images);
	console.log(inputs);
	console.log(menus);
	console.log(menuItems);
	console.log(options);
	console.log(optgroups);
	console.log(selects);
	console.log(textareas);
	console.log(URL);
	
	$(document).keypress(function() {
		console.log(event.which);
	});
	
	anchors.click(function() {
		if (this.id != "") { 
			console.log(this.id);
		}
		else if (this.name != "") {
			console.log(this.name);
		}
		else if (this.href != "") {
			console.log(this.href);
		}
		
		sendMsg("click", "href", this.href, "");
	});
	
	buttons.click(function() {
		if (this.id != "") {
			console.log(this.id);
		}
		else if (this.name != "") {
			console.log(this.name);
		}
		else if (this.title != "") {
			console.log(this.title);
		}
		else if (this.className != "") {
			console.log(this.className);
		}
	});
	
	forms.submit(function() {
		console.log("OK");
	});
	
	images.click(function() {
		if (this.id != "") {
			console.log(this.id);
		}
		else if (this.name != "") {
			console.log(this.name);
		}
	});
	
	inputs.click(function() {
		if (this.id != "") {
			console.log(this.id);
		}
		else if (this.name != "") {
			console.log(this.name);
		}
	});
	
	inputs.change(function() {
		alert(this.value);
	});

	selects.click(function() {
		console.log(this.name);
	});
	
	selects.change(function() {
		console.log(this.value);
	});
	
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

