//popup.js

var startButton = document.getElementById("btn-start");
var loginButton = document.getElementById("btn-login");
var signUpButton = document.getElementById("btn-signup");
var errorLoginButton = document.getElementById("btn-error-login");
var doneButton = document.getElementById("btn-done");
var cancelRecordButton = document.getElementById("btn-cancel-record");
var saveButton = document.getElementById("btn-save");
var cancelSaveButton = document.getElementById("btn-cancel-save");
var resultButton = document.getElementById("btn-result");

startButton.addEventListener("click", startRecording);
doneButton.addEventListener("click", doneRecording);
cancelRecordButton.addEventListener("click", cancelRecording);
cancelSaveButton.addEventListener("click", cancelSaving);
saveButton.addEventListener("click", saveRecord);

function appear(screen) {
	return document.querySelector(screen).style.display = "block";
}

function dissapear(screen) {
	return document.querySelector(screen).style.display = "none";
}

function startRecording() {
	dissapear("#scr-start");
	appear("#scr-recording");
}

function doneRecording() {
	dissapear("#scr-recording");
	appear("#scr-save");
}

function cancelRecording() {
	dissapear("#scr-recording");
	appear("#scr-start");
}

function cancelSaving() {
	dissapear("#scr-save");
	appear("#scr-start");
}

function saveRecord() {
	dissapear("#scr-save");
	appear("#scr-result");
}

