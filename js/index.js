/* src: http://stackoverflow.com/questions/26057572/string-to-unique-hash-in-javascript-jquery */
function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var current_oscillators = [];
function applyOscillators(oscillators) {
	for (var i = 0; i < current_oscillators.length; i++) {
		current_oscillators[i].stop();
	}
	for (var i = 0; i < oscillators.length; i++) {
		oscillators[i].play();
	}
	current_oscillators = oscillators;
}

var numWords = 0;
function textDidChange(text) {
	var words = text.split(/[ ,]+/);
	console.log("num words found: " + words.length);
	if (words.length != numWords) {
		var oscillators = calculateOscillators(words);
		numWords = words.length;
		applyOscillators(oscillators);
		laughTrack.volume = Math.min(1, numWords / 40);
	}
}

function calculateOscillators(words, k=5) {
	var oscillators = [];
	if (words.length >= k) {
		words = words.slice(words.length - k - 1, words.length);
		for (var i = 0; i < words.length; i++) {
			freq = (hashCode(words[i]) % 4000) + 200;
			osc = new Pizzicato.Sound({ 
							    source: 'wave', 
							    options: {
							        frequency: freq
							    }
							});
			oscillators.push(osc);
		}
	}
	return oscillators;
}

/* http://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery */
var oldVal = "";
$("#textarea").on("change keyup paste", function() {
    var currentVal = $(this).val();
    if(currentVal == oldVal) {
        return; //check to prevent multiple simultaneous triggers
    }

    oldVal = currentVal;
    textDidChange(currentVal);
});

var laughTrack = new Pizzicato.Sound({ 
    source: 'file',
    options: {path: ['sound/laugh.wav', 'sound/laugh.mp3'], loop: true}
}, function() {
    console.log('sound file loaded!');
	laughTrack.play();
});


