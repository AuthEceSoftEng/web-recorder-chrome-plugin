//content.js

$('input').on('keydown', function() {
     if (this.value.length > 1) {
		 console.log(this);
     }
});

$('button').on('click', function() {
	console.log(this);
});

$('a').on('click', function() {
	console.log(this);
});

console.log($('a'));
console.log($('button'));
console.log($('input'));


