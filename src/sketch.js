let canvas;

const auto = new Automata();

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch');
    background(0);
    textAlign(CENTER, CENTER);
    textSize(sizeOfText);
}

function draw() {
    auto.playStep();
    auto.draw();
}

function mouseClicked() {
    auto.mouseEvent(MouseEvents.Click);
}

function mouseDragged() {
    auto.mouseEvent(MouseEvents.Drag);
}

function mouseReleased() {
    auto.mouseEvent(MouseEvents.Up);
}

function keyReleased() {
    auto.keyReleased();
}

function keyPressed() {
    if (keyIsDown(18) && keyIsDown(65)) {
        auto.setMode(GUIModes.ArrowDragging);
    } else if (keyIsDown(18) && keyIsDown(83)) {
        auto.setMode(GUIModes.NodeDragging);
    } else if (keyIsDown(18) && keyIsDown(82)) {
        resetAutomaton();
    }
}

function resetAutomaton() {
    auto.reset();
    auto.displayMessage("Reset the machine. Please enter the character set");
}

const nodeModeBtn = document.getElementById('node-mode');
nodeModeBtn.addEventListener('click', () => {
    auto.setMode(GUIModes.NodeDragging);
    auto.needsDrawUpdate = true;
});

const arrowModeBtn = document.getElementById('arrow-mode');
arrowModeBtn.addEventListener('click', () => {
    auto.setMode(GUIModes.ArrowDragging);
    auto.needsDrawUpdate = true;
});

const charsetBtn = document.getElementById('set-chars-btn');

charsetBtn.addEventListener('click', () => {
    if (auto.flags.setInputs) return;

    if (auto.setInputs(charsetInp.value)) {
        charsetInp.value = '';
        charsetInp.disabled = true;
        startInp.disabled = false;
        subInp.disabled = false;
        endInp.disabled = false;
        playInp.disabled = false;
    }
});

const resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', () => {
    resetAutomaton();
});

const startBtn = document.getElementById('set-start-btn');
startBtn.addEventListener('click', () => {
    if (auto.flags.playing) return;
    auto.setStart(startInp.value);
    startInp.value = '';
});

const subBtn = document.getElementById('set-sub-btn');
subBtn.addEventListener('click', () => {
    if (auto.flags.playing) return;
    auto.setSubstring(subInp.value);
    subInp.value = '';
});

const endBtn = document.getElementById('set-end-btn');
endBtn.addEventListener('click', () => {
    if (auto.flags.playing) return;
    auto.setEnd(endInp.value);
    endInp.value = '';
});

overlapBtn.addEventListener('click', () => {
    if (auto.flags.playing) return;

    if (auto.flags.overlap) {
        auto.flags.overlap = false;
        overlapBtn.classList.remove('btn-success');
        overlapBtn.classList.add('btn-danger');
        return;
    }

    auto.flags.overlap = true;
    overlapBtn.classList.remove('btn-danger');
    overlapBtn.classList.add('btn-success');
});

const playBtn = document.getElementById('play-btn');
playBtn.addEventListener('click', () => {
    if (auto.flags.playing) return;

    if (auto.setPlaying(playInp.value)) {
        playInp.value = '';
        playInp.disabled = true;
        startInp.disabled = true;
        subInp.disabled = true;
        endInp.disabled = true;
    }
});

const shareTextArea = document.getElementById('model-json');

const saveJSONBtn = document.getElementById('save-model-btn');
saveJSONBtn.addEventListener('click', () => {
    shareTextArea.value = JSON.stringify(auto.toJSON());
});

const loadJSONBtn = document.getElementById('load-model-btn');
loadJSONBtn.addEventListener('click', () => {
    if (shareTextArea.value === '' || auto.flags.playing) return;

    auto.fromJSON(shareTextArea.value);
})