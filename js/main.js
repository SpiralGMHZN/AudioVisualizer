window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    if (!window.color){window.color="black";}
    if (!window.capcolor){window.capcolor="#ffffff";}
    if (!window.gap){window.gap=2;}
    if (!window.amount){window.amount=3000;}
    if (!window.width){window.width=10;}
    if (!window.capheight){window.capheight=0;}
    if (!window.color50){window.color50=window.color;}
    if (!window.color25){window.color25=window.color;}
    if (!window.color75){window.color75=window.color;}

    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    audio.crossOrigin="anonymous";
    ctx.crossOrigin = "anonymous";
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var canvas = document.getElementById('canvas')
    canvas.style.zIndex=-5;
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = window.width,
        gap = window.gap,
        capHeight = window.capheight,
        capStyle = window.capcolor,
        meterNum = window.amount / (10 + 2),
        capYPositionArray = [];
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, window.color);
    gradient.addColorStop(0.75, window.color75);
    gradient.addColorStop(0.5, window.color50);
    gradient.addColorStop(0.25, window.color25);
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum);
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient;
            ctx.fillRect(i * 12 , cheight - value + capHeight, meterWidth, cheight);
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();
};
