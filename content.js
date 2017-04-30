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
	console.log(currentPage);
	
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
		var val = identify(this);
		
		sendMsg("change", val[0], val[1], this.value);
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
	else if (getXPath(e) != "") {
		identifier = getXPath(e);
		type = "xpath";
	
	return [type, identifier];
}

function sendMsg(type, identifier, id_value, input_value) {
	chrome.runtime.sendMessage({action: "append", obj: {type: type, identifier: identifier, id: id_value, input: input_value}});
}

var cssSelector = function (target) {
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
    
};

function getXPath(node) {
    var comp, comps = [];
    var parent = null;
    var xpath = '';
    var getPos = function(node) {
        var position = 1, curNode;
        if (node.nodeType == Node.ATTRIBUTE_NODE) {
            return null;
        }
        for (curNode = node.previousSibling; curNode; curNode = curNode.previousSibling) {
            if (curNode.nodeName == node.nodeName) {
                ++position;
            }
        }
        return position;
     }

    if (node instanceof Document) {
        return '/';
    }

    for (; node && !(node instanceof Document); node = node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode) {
        comp = comps[comps.length] = {};
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                comp.name = 'text()';
                break;
            case Node.ATTRIBUTE_NODE:
                comp.name = '@' + node.nodeName;
                break;
            case Node.PROCESSING_INSTRUCTION_NODE:
                comp.name = 'processing-instruction()';
                break;
            case Node.COMMENT_NODE:
                comp.name = 'comment()';
                break;
            case Node.ELEMENT_NODE:
                comp.name = node.nodeName;
                break;
        }
        comp.position = getPos(node);
    }

    for (var i = comps.length - 1; i >= 0; i--) {
        comp = comps[i];
        xpath += '/' + comp.name;
        if (comp.position != null) {
            xpath += '[' + comp.position + ']';
        }
    }

    return xpath;

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




