window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    if (!window.color){window.color"black"}
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
        meterWidth = 10,
        gap = 2,
        capHeight = 2,
        capStyle = '#ffffff',
        meterNum = 3000 / (10 + 2),
        capYPositionArray = [];
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, window.color);
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
