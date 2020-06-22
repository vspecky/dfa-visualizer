class StateNode {
    constructor(number, x, y, type=NodeTypes.Standard, state=NodeStates.Inactive) {
        this.number = number;
        this.out = new Map();
        this.type = type;
        this.pos = createVector(x, y);
        this.state = state;
    }

    draw() {
        fill(this.state === 0 ? bgColor : activeFillColor);
        stroke(strokeColor);
        circle(this.pos.x, this.pos.y, nodeDiameter);
        if (this.type === NodeTypes.Final) {
            circle(this.pos.x, this.pos.y, nodeDiameter - 20);
        }

        fill(textFillColor);
        text(this.type === NodeTypes.Reject ? 'R' : `q${this.number}`, this.pos.x, this.pos.y);
    }

    updatePosition(x, y) {
        const xVal = Math.max(0, Math.min(x, canvasWidth));
        const yVal = Math.max(0, Math.min(y, canvasHeight));

        this.pos.x = xVal;
        this.pos.y = yVal;
    }

    deleteConnection(conn) {
        if (this.out.has(conn.label)) {
            this.out.delete(conn.label);
        }
    }

    containsMouse() {
        return dist(mouseX, mouseY, this.pos.x, this.pos.y) < (nodeDiameter / 2);
    }

    setType(type) {
        this.type = type;
    }

    setState(state) {
        this.state = state;
    }

    getType() {
        switch (this.type) {
            case NodeTypes.Standard: return 'Standard';
            case NodeTypes.Final: return 'Final';
            case NodeTypes.Reject: return 'Reject';
        }
    }
}