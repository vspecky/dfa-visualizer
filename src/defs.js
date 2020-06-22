new p5();

const canvasWidth = 1900;
const canvasHeight = 950;

const arrowPtSqWidth = 25;

let bgColor = 10;
let strokeColor = 255;
let textFillColor = 255;

const activeFillColor = 'rgb(100, 100, 0)';
const activeCharColor = 'rgb(255, 0, 0)';

const nodeDiameter = 100;

const arrowSize = 12;

const labelCircleDiameter = 40;

const sizeOfText = 25;

let playFrameRate = 1;

const NodeTypes = Object.freeze({
    Standard: 0,
    Final: 1,
    Reject: 2,
});

const NodeStates = Object.freeze({
    Inactive: 0,
    Active: 1,
});

const GUIModes = Object.freeze({
    NodeDragging: 0,
    ArrowDragging: 1,
    PlayingString: 2,
});

const MouseEvents = Object.freeze({
    Click: 0,
    Drag: 1,
    Up: 2
});

const message = document.getElementById('msg');

const charsetInp = document.getElementById('set-chars-inp');
const startInp = document.getElementById('set-start-inp');
const subInp = document.getElementById('set-sub-inp');
const endInp = document.getElementById('set-end-inp');
const overlapBtn = document.getElementById('overlap');
const playInp = document.getElementById('play-inp');