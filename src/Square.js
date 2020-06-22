class Square {
    constructor(x, y, conn) {
        this.xCenter = x;
        this.yCenter = y;
        this.w = arrowPtSqWidth;
        this.x = x - arrowPtSqWidth / 2;
        this.y = y - arrowPtSqWidth / 2;
        this.connection = conn;
    }

    mouseIsInside() {
        return (mouseX > this.x && mouseX < this.x + this.w) &&
            (mouseY > this.y && mouseY < this.y + this.w);
    }

    updatePosition(x, y) {
        const xVal = Math.max(0, Math.min(x, canvasWidth));
        const yVal = Math.max(0, Math.min(y, canvasHeight));

        this.xCenter = xVal;
        this.yCenter = yVal;
        this.x = xVal - this.w / 2;
        this.y = yVal - this.w / 2;
    }

    draw() {
        stroke(this.mouseIsInside() ? 'rgb(0, 255, 0)' : 255);
        noFill();
        rect(this.x, this.y, this.w);
    }
}