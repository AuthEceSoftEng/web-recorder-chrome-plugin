var testName;
var suiteName;
var websiteURL = 'http://snf-766614.vm.okeanos.grnet.gr:8080/';
var serverURL = 'http://snf-766614.vm.okeanos.grnet.gr:4000/';

function appear(screen) {
	return document.querySelector(screen).style.display = "block";
}

function dissapear(screen) {
	return document.querySelector(screen).style.display = "none";
}

function recorderProxy() {
	this.active = null;
}

recorderProxy.prototype.login = function() {
	chrome.runtime.sendMessage({action: "login", email: document.querySelector('input#fld-email').value, password: document.querySelector('input#fld-password').value}, function(response) {
		if (response.login) ui.setStarted();
		else ui.setLoginError();	
	});
}

recorderProxy.prototype.logout = function() {
	chrome.runtime.sendMessage({action: "logout"});
}

recorderProxy.prototype.start = function() {
	chrome.runtime.sendMessage({action: "start"});
}

recorderProxy.prototype.done = function() {
	chrome.runtime.sendMessage({action: "done"});
}

recorderProxy.prototype.operating = function() {
	chrome.runtime.sendMessage({action: "operations"});
}

recorderProxy.prototype.asserting = function() {
	chrome.runtime.sendMessage({action: "assertions"});
}

recorderProxy.prototype.stop = function() {
	chrome.runtime.sendMessage({action: "stop"});
}

recorderProxy.prototype.saving = function() {
	testName = document.querySelector('input#fld-name').value;
	suiteName = document.querySelector('select#fld-suite').value;
	
	chrome.runtime.sendMessage({action: "save", testName: document.querySelector('input#fld-name').value, suiteName: document.querySelector('select#fld-suite').value}, function(response) {
		if (response.save) ui.setResult();
		else ui.setSaveError();
	});
}

function recorderUI() {
	this.recorder = new recorderProxy();
	
	chrome.runtime.sendMessage({action: "get_status"}, function(response) {
		
		if (response.active) {
			ui.startRecording();
			
			if (response.assertions) ui.asserting();
			else ui.operating();
		}
		else {
			if (response.screen == "login") ui.setLogin();
			else if (response.screen == "start") ui.setStarted();
			else if (response.screen == "done") ui.doneRecording();
			else if (response.screen == "stop") ui.setStarted();
			else if (response.screen == "save") ui.saveRecord();
			else if (response.screen == "save-error") ui.setSave();
		}
	});
}

recorderUI.prototype.setLogin = function() {
	dissapear("#scr-start");
	dissapear("#scr-recording");
	dissapear("#scr-save");
	dissapear("#scr-result");
	dissapear("#scr-error-login");
	dissapear("#scr-error-save");
	appear("#scr-login");
}

recorderUI.prototype.setLoginError = function() {
	dissapear("#scr-login");
	appear("#scr-error-login");
}

recorderUI.prototype.setSave = function() {
	dissapear("#scr-start");
	dissapear("#scr-login");
	dissapear("#scr-error-login");
	dissapear("#scr-recording");
	dissapear("#scr-error-save");
	dissapear("#scr-result");
	appear("#scr-save");
}

recorderUI.prototype.operating = function() {
	document.getElementById("btn-operations").setAttribute("disabled", "disabled");
	document.getElementById("btn-assertions").removeAttribute("disabled");
}

recorderUI.prototype.asserting = function() {
	document.getElementById("btn-assertions").setAttribute("disabled", "disabled");
	document.getElementById("btn-operations").removeAttribute("disabled");
}

recorderUI.prototype.setResult = function() {
	dissapear("#scr-save");
	dissapear("#scr-error-save");
	appear("#scr-result");
}

recorderUI.prototype.setSaveError = function() {
	dissapear("#scr-save");
	dissapear("#scr-result");
	appear("#scr-error-save");
}

recorderUI.prototype.setLogout = function() {
	dissapear("#scr-start");
	appear("#scr-login");
	
	ui.recorder.logout();
	
	return false;
}

recorderUI.prototype.setStarted = function() {
	dissapear("#scr-login");
	dissapear("#scr-error-login");
	dissapear("#scr-error-save");
	dissapear("#scr-recording");
	dissapear("#scr-save");
	dissapear("#scr-result");
	appear("#scr-start");
}

recorderUI.prototype.startRecording = function() {
	dissapear("#scr-start");
	appear("#scr-recording");
	
	ui.recorder.start();
	
	return false;
}

recorderUI.prototype.doneRecording = function() {
	dissapear("#scr-recording");
	appear("#scr-save");
	
	ui.recorder.done();
	
	return false;
}

recorderUI.prototype.cancelRecording = function() {
	dissapear("#scr-recording");
	appear("#scr-start");
	
	ui.recorder.stop();
	
	return false;
}

recorderUI.prototype.saveRecord = function() {
	dissapear("#scr-save");
	appear("#scr-result");
	
	ui.recorder.saving();
	
	return false;
}

recorderUI.prototype.cancelSaving = function() {
	dissapear("#scr-save");
	appear("#scr-start");
	
	ui.recorder.stop();
	
	return false;
}

var ui;

window.onload = function() {
	document.querySelector('button#btn-login').onclick = function() {
		ui.recorder.login();
		return false;
	};
	
	document.querySelector('button#btn-error-login').onclick = function() {
		ui.setLogin();
		return false;
	};
	
	document.querySelector('button#btn-start').onclick = function() {
		window.close();
		ui.startRecording();
		return false;
	};
	
	document.querySelector('a#signout').onclick = function() {
		ui.setLogout();
		return false;
	};
	
	document.querySelector('button#btn-done').onclick = function() {
		ui.doneRecording();
		return false;
	};
	
	document.querySelector('button#btn-operations').onclick = function() {
		window.close();
		ui.operating();
		ui.recorder.operating();
		return false;
	};
	
	document.querySelector('button#btn-assertions').onclick = function() {
		window.close();
		ui.asserting();
		ui.recorder.asserting();
		return false;
	};
	
	document.querySelector('a#cancel-record').onclick = function() {
		window.close();
		ui.cancelRecording();
		return false;
	};
	
	document.querySelector('button#btn-save').onclick = function() {
		ui.recorder.saving();
		return false;
	};
	
	document.querySelector('button#btn-error-save').onclick = function() {
		ui.setSave();
		return false;
	}
	
	document.querySelector('button#btn-cancel-save').onclick = function() {
		window.close();
		ui.cancelSaving();
		return false;
	};
	
	document.querySelector('a#btn-result').onclick = function() {
		document.getElementById('btn-result').setAttribute('href', websiteURL + 'dashboard/suites/' + suiteName + '/tests/' + testName);
	}
	
	ui = new recorderUI();
}

$(function() {
	var user = JSON.parse(localStorage.getItem('currentUser'));
	
	$.ajax({
		type: "GET",
		headers: {
			'Authorization': 'Bearer ' + user.token
		},
		url: serverURL + user._id + '/suiteNames',
		success: function(data) {
			var select = document.getElementById('fld-suite');
			
			data = data.sort(function(a, b) {
				return a.localeCompare(b);
			});
			
			for (var i in data) {
				$(select).append('<option value=' + data[i] + '>' + data[i] + '</option>');
			}
		}
	});
});

