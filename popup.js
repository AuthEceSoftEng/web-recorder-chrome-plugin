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

recorderProxy.prototype.stop = function() {
	chrome.runtime.sendMessage({action: "stop"});
}

recorderProxy.prototype.saving = function() {
	chrome.runtime.sendMessage({action: "save"});
}

function recorderUI() {
	this.recorder = new recorderProxy();
	
	chrome.runtime.sendMessage({action: "get_status"}, function(response) {
		
		if (response.active) {
			ui.startRecording();
		}
		else {
			if (response.screen == "login") ui.setLogin();
			else if (response.screen == "login-error") ui.setLoginError();
			else if (response.screen == "start") ui.setStarted();
			else if (response.screen == "done") ui.doneRecording();
			else if (response.screen == "stop") ui.setStarted();
			else if (response.screen == "save") ui.saveRecord();
		}
	});
}

recorderUI.prototype.setLogin = function() {
	dissapear("#scr-start");
	dissapear("#scr-recording");
	dissapear("#scr-save");
	dissapear("#scr-result");
	dissapear("#scr-error-login");
	appear("#scr-login");
}

recorderUI.prototype.setLoginError = function() {
	dissapear("#scr-login");
	appear("#scr-error-login");
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
	
	document.querySelector('button#btn-cancel-record').onclick = function() {
		ui.cancelRecording();
		return false;
	};
	
	document.querySelector('button#btn-save').onclick = function() {
		ui.saveRecord();
		return false;
	};
	
	document.querySelector('button#btn-cancel-save').onclick = function() {
		ui.cancelSaving();
		return false;
	};
	
	document.querySelector('a#btn-result').onclick = function() {
		ui.setStarted();
		ui.recorder.stop();
		return false;
	};
	
	ui = new recorderUI();
}

