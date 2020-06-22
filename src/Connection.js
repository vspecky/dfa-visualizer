class Connection {
    constructor(from, to, label) {
        this.from = from;
        this.to = to;
        this.label = label;

        if (this.from !== this.to) {
            const x1 = this.from.pos.x;
            const y1 = this.from.pos.y;
            const x2 = this.to.pos.x;
            const y2 = this.to.pos.y;

            const sq1X = Math.floor((2 * x2 + x1) / (2 + 1));
            const sq1Y = Math.floor((2 * y2 + y1) / (2 + 1));

            const sq2X = Math.floor((x1 + sq1X) / 2);
            const sq2Y = Math.floor((y1 + sq1Y) / 2);

            this.sq1 = new Square(sq1X, sq1Y, this);
            this.sq2 = new Square(sq2X, sq2Y, this);
            return;
        }

        this.sq1 = new Square(0, 0, this);
        this.sq1.updatePosition(this.from.pos.x + 30, this.from.pos.y - 80);

        this.sq2 = new Square(0, 0, this);
        this.sq2.updatePosition(this.from.pos.x - 30, this.from.pos.y - 80);
    }

    draw() {
        const d = dist(this.sq1.xCenter, this.sq1.yCenter, this.to.pos.x, this.to.pos.y);

        const ratio = (d / (nodeDiameter / 2)) - 1;

        const pt = {
            x: (this.sq1.xCenter + ratio * this.to.pos.x) / (ratio + 1),
            y: (this.sq1.yCenter + ratio * this.to.pos.y) / (ratio + 1)
        };

        const arrowRatio = (d / (nodeDiameter / 2 + arrowSize)) - 1;

        const arrowPt = {
            x: (this.sq1.xCenter + arrowRatio * this.to.pos.x) / (arrowRatio + 1),
            y: (this.sq1.yCenter + arrowRatio * this.to.pos.y) / (arrowRatio + 1)
        };


        stroke(strokeColor);
        noFill();
        beginShape();
        curveVertex(this.from.pos.x, this.from.pos.y);
        curveVertex(this.from.pos.x, this.from.pos.y);
        curveVertex(this.sq2.xCenter, this.sq2.yCenter);
        curveVertex(this.sq1.xCenter, this.sq1.yCenter);
        curveVertex(arrowPt.x, arrowPt.y);
        curveVertex(arrowPt.x, arrowPt.y);
        endShape();

        const labelX = (this.sq2.xCenter + this.sq1.xCenter) / 2;
        const labelY = (this.sq2.yCenter + this.sq1.yCenter) / 2;

        fill(bgColor);
        circle(labelX, labelY, labelCircleDiameter);
        fill(textFillColor);
        text(this.label, labelX, labelY);

        pt.x -= this.sq1.xCenter;
        pt.y -= this.sq1.yCenter;

        push();
        translate(this.sq1.xCenter, this.sq1.yCenter);
        const vec = createVector(pt.x, pt.y);

        rotate(vec.heading());

        translate(vec.mag() - arrowSize, 0);
        fill(textFillColor);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }

    delete() {
        this.from.deleteConnection(this);
    }
}