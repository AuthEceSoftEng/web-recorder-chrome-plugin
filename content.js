$(function() {
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
	
	document.addEventListener("click", function(e) {
		console.log(e.target);
	});
	
	/*anchors.click(function() {
		if (this.id != "") { 
			alert(this.id);
		}
		else if (this.name != "") {
			alert(this.name);
		}
		else if (this.href != "") {
			alert(this.href);
		}
	});
	
	buttons.click(function() {
		if (this.id != "") {
			alert(this.id);
		}
		else if (this.name != "") {
			alert(this.name);
		}
	});
	
	forms.submit(function() {
		alert("OK");
	});
	
	images.click(function() {
		if (this.id != "") {
			alert(this.id);
		}
		else if (this.name != "") {
			alert(this.name);
		}
	});
	
	inputs.click(function() {
		if (this.id != "") {
			alert(this.id);
		}
		else if (this.name != "") {
			alert(this.name);
		}
	});
	
	inputs.change(function() {
		alert(this.value);
	});*/
	
});