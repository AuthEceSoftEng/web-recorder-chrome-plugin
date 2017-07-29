var assertionsClickHandler = function (element) {
	var val = identify(element);
	
	chrome.runtime.sendMessage({action: "append_assertion", obj: {type: "present", identifier: val[0], id: val[1], input: "", url: window.location.href, status: "PENDING", error: "", description: ""}});
	
	assertions.start();
}

var assertions = DomOutline({ onClick: assertionsClickHandler });
var currentPage = window.location.href;
var asserting = false;

function startRecorder() {
	var anchors = $("a");
	var areas = $("area");
	var buttons = $("button");
	var inputs = $("input");
	var selects = $("select");
	var textareas = $("textarea");
	currentPage = window.location.href;
	
	$(document).click(function(event) {
		if (asserting){
			console.log(event);
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			$('a').off('click');
		}
	});
	
	var promise = new Promise(function(resolve, reject) {
		anchors.click(function() {
			var val = identify(this);
			
			val.push("click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		anchors.dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		anchors.contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		areas.click(function() {
			var val = identify(this);
			
			val.push("click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		areas.dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		areas.contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		buttons.click(function() {
			var val = identify(this);
			
			val.push("click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		buttons.dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		buttons.contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		inputs.click(function() {
			var val = identify(this);
			
			val.push("click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		inputs.dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		inputs.contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});

		textareas.click(function() {
			var val = identify(this);
			
			val.push("click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		textareas.dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		textareas.contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
	
		$(document).click(function(event) {
			if (event.target.tagName != "SELECT") {
				var val = identify(event.target);
			
				val.push("click");
				val.push("");
				val.push(window.location.href);
			
				resolve(val);
			}
		});
		
		$(document).dblclick(function() {
			var val = identify(this);
			
			val.push("db-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		$(document).contextmenu(function() {
			var val = identify(this);
			
			val.push("right-click");
			val.push("");
			val.push(window.location.href);
			
			resolve(val);
		});
		
		inputs.change(function() {
			if (this.type != "radio" && this.type != "checkbox" && this.type != "range") {
				var val = identify(this);
				
				val.push("change");
				val.push(this.value);
				val.push(window.location.href);
				
				resolve(val);
			}
		});
		
		selects.change(function() {
			var val = identify(this);
			
			val.push("select");
			val.push(this.value);
			val.push(window.location.href);
			
			resolve(val);
		});
		
		textareas.change(function() {
			var val = identify(this);
			
			val.push("change");
			val.push(this.value);
			val.push(window.location.href);
			
			resolve(val);
		});
		
		$(document).change(function(event) {
			if (event.target.type != "radio" && event.target.type != "checkbox" && event.target.type != "range") {
				var val = identify(event.target);
				
				val.push("change");
				val.push(event.target.value);
				val.push(window.location.href);
				
				resolve(val);
			}
		});
		
	}).then(function(result) {
		sendMsg(result[2], result[0], result[1], result[3], result[4]);
	}).then(function() {
		startRecorder();
		//setTimeout(function() { startRecorder(); }, 0.0001);
	});
	
	/*var promiseChange = new Promise(function(resolve, reject) {
		inputs.change(function() {
			if (this.type != "radio" && this.type != "checkbox" && this.type != "range") {
			console.log('input');
				var val = identify(this);
				
				val.push("change");
				val.push(this.value);
				val.push(window.location.href);
				
				resolve(val);
			}
		});
		
		selects.change(function() {
		console.log('select');
			var val = identify(this);
			
			val.push("select");
			val.push(this.value);
			val.push(window.location.href);
			
			resolve(val);
		});
		
		textareas.change(function() {
		console.log('textarea');
			var val = identify(this);
			
			val.push("change");
			val.push(this.value);
			val.push(window.location.href);
			
			resolve(val);
		});
		
		$(document).change(function(event) {
			if (event.target.type != "radio" && event.target.type != "checkbox" && event.target.type != "range") {
				var val = identify(event.target);
				
				val.push("change");
				val.push(event.target.value);
				val.push(window.location.href);
				
				resolve(val);
				console.log('document');
			}
		});
		
	}).then(function(result) {
		sendMsg(result[2], result[0], result[1], result[3], result[4]);
	}).then(function() {
		setTimeout(function() { startRecorder(); }, 100);
	});*/
}

function identify(e) {
	var type, identifier;
	
	if (e.id != "") {
		identifier = e.id;
		type = "id";
	}
	else if (getXPath(e) != "") {
		identifier = getXPath(e);
		type = "xpath";
	}
	else if (cssSelector(e) != "") {
		identifier = cssSelector(e).replace(/\\\"/g, '\\\\\\"');
		type = "css";
	}
	else if (e.name != "") {
		identifier = e.name;
		type = "name";
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

function sendMsg(type, identifier, id_value, input_value, url) {
	chrome.runtime.sendMessage({action: "append", obj: {type: type, identifier: identifier, id: id_value, input: input_value, inputType: "freetext", url: url, status: "PENDING", error: "", description: ""}});
}

chrome.runtime.onMessage.addListener(function(req, send, sendResponse) {
	if (req.action == "start") {
		startRecorder();
		chrome.runtime.sendMessage({action: "append", obj: {type: "get", id: "", URL: currentPage, status: "PENDING", error: "", description: ""}});
	}
	
	if ((req.action == "stop" || req.action == "done") && req.clicked == false) {
		location.reload();
	}
	
	if (req.action == "operations") {
		asserting = false;
		assertions.stop();
	}
	
	if (req.action == "assertions") {
		asserting = true;
		assertions.start();
	}
	
});

chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    if (response.active) {
        startRecorder();
    }
	
});

/*setInterval(function() {
	chrome.runtime.sendMessage({action: "get_status"}, function(response) {
		if (response.active) {
			if (currentPage != window.location.href) {
				currentPage = window.location.href;
				startRecorder();
			}
		}
    });
}, 500);*/


