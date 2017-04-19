function startRecorder() {
	var anchors = $("a");
	var buttons = $("button");
	var forms = $("form");
	var images = $("img");
	var inputs = $("input");
	var menus = $("menu");
	var menuItems = $("menuitem");
	var options = $("option");
	var selects = $("select");
	var URL = window.location.href;
	
	console.log("Recorder started");
	console.log(anchors);
	console.log(buttons);
	console.log(forms);
	console.log(images);
	console.log(inputs);
	console.log(menus);
	console.log(menuItems);
	console.log(options);
	console.log(selects);
	console.log(URL);
	
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

