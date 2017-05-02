var currentPage = window.location.href;

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
	currentPage = window.location.href;
	
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
	
	/*forms.submit(function() {
		var val = identify(this);
		
		sendMsg("submit", val[0], val[1], "");
	});*/
	
	inputs.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});
	
	inputs.change(function() {
		if (this.type != "radio") {
			var val = identify(this);
			
			sendMsg("change", val[0], val[1], this.value);
		}
	});

	/*selects.click(function() {
		var val = identify(this);
		
		sendMsg("click", val[0], val[1], "");
	});*/
	
	selects.change(function() {
		var val = [];
		val[0] = "css";
		val[1] = "option[value='" + this.value + "']";
		
		selects.click(function() {
			var sec_val = identify(this);

			sendMsg("click", sec_val[0], sec_val[1], "");
			sendMsg("click", val[0], val[1], "");
		});
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
	else if (getXPath(e) != "") {
		identifier = getXPath(e);
		type = "xpath";
	}
	else if (cssSelector(e) != "") {
		identifier = cssSelector(e).replace(/\\\"/g, '\\\\\\"');
		type = "css";
	}
	else if (e.className != "") {
		identifier = e.className;
		type = "className";
	}
	else if (e.text != "") {
		identifier = e.text;
		type = "linkText";
	}
	
	return [type, identifier];
}

function cssSelector(target) {
	var query = '';

    if (target == document)
    	query = 'body';
    else {
    	var attr = ['ng-model', 'ng-href', 'name', 'aria-label'].reduce(function (a, b) { return a || (target.getAttribute(b) ? b : null); }, null);
    	
        if (attr)
        	query = target.tagName.toLowerCase() + '[' + attr + '="' + target.getAttribute(attr).replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0') + '"]';
        else
        	query = target.tagName.toLowerCase();

		var nodes = target.parentNode.querySelectorAll(query);
		
        if (nodes && nodes.length > 1)
        	query += ':nth-of-type(' + (Array.prototype.slice.call(nodes).indexOf(target) + 1).toString() + ')';

		query = query.replace(/\s/g, ' ');
	}

    if (document.querySelectorAll(query).length > 1 && target.parentNode)
    	query = cssSelector(target.parentNode) + '>' + query;

    return query;
    
}

function getXPath(element) {
	var path = [];

	do {
		if (element.id) {
			path.unshift('id("' + element.id + '")');
			break;
		}
		else if (element.parentNode) {
			var nodeName = element.nodeName;
			var hasNamedSiblings = Boolean(element.previousElementSibling || element.nextElementSibling);
			var index = 1;
			var sibling = element;

			if (hasNamedSiblings) {
				while ((sibling = sibling.previousElementSibling)) {
					if (sibling.nodeName === nodeName) {
						++index;
					}
				}

				path.unshift(nodeName + '[' + index + ']');
			}
			else {
				path.unshift(nodeName);
			}
		}
		else {
			path.unshift('');
		}
	} while ((element = element.parentNode));

	return path.join('/');
	
}

function sendMsg(type, identifier, id_value, input_value) {
	chrome.runtime.sendMessage({action: "append", obj: {type: type, identifier: identifier, id: id_value, input: input_value}});
}

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	if (req.action == "start") {
		startRecorder();
		chrome.runtime.sendMessage({action: "append", obj: {type: "get", URL: currentPage}});
	}
	
	if ((req.action == "stop" || req.action == "done") && req.clicked == false) {
		location.reload();
	}
	
});

chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    if (response.active) {
        startRecorder();
    }
	
});

setInterval(function() {
	chrome.runtime.sendMessage({action: "get_status"}, function(response) {
		if (response.active) {
			if (currentPage != window.location.href) {
				currentPage = window.location.href;
				startRecorder();
			}
		}
    });
}, 500);


