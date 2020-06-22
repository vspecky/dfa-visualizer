class Automata {
    constructor() {
        this.reset();
    }

    reset() {
        this.nodes = new Set();
        this.connections = new Set();
        this.squares = new Set();
        this.draggable = null;
        this.mode = GUIModes.NodeDragging;
        this.needsDrawUpdate = true;
        this.inputLabels = [];
        this.nextState = 0;
        this.nextReject = -1;

        this.flags = {
            dragging: false,
            arrowing: false,
            playing: false,
            setInputs: false,
            setStart: false,
            overlap: false,
        };

        this.playInfo = {
            start: '',
            sub: '',
            end: '',
        };

        this.playing = {
            str: null,
            ptr: 0,
            current: null,
        };

        this.arrowing = {
            label: '',
            from: null
        };

        charsetInp.disabled = false;
        startInp.disabled = true;
        subInp.disabled = true;
        endInp.disabled = true;
        overlapBtn.classList.remove('btn-success');
        overlapBtn.classList.add('btn-danger');
        playInp.disabled = true;
    }

    setInputs(chars) {
        if (chars.length === 0) {
            this.displayMessage("Please provide input characters.");
            return false;
        }

        const inputs = [...new Set(chars.replace(/ +/g, '').split(''))];

        for (const char of inputs) {
            const charCode = char.charCodeAt(0);

            if (!charCode || charCode < 97 || charCode > 122) {
                this.displayMessage("Please use valid characters (a-z, small)");
                return false;
            }
        }

        this.inputLabels = inputs;
        this.flags.setInputs = true;
        this.displayMessage("Character set received");
        this.needsDrawUpdate = true;
        return true;
    }

    mouseEvent(e) {
        if (this.flags.playing /*|| !this.flags.setInputs*/) return;

        if (e === MouseEvents.Up && this.flags.dragging) {
            this.flags.dragging = false;
            this.draggable = null;
        }

        switch (this.mode) {
            case GUIModes.NodeDragging:
                switch (e) {
                    case MouseEvents.Click: this.handleNodeClick(); break;
                    case MouseEvents.Drag: this.handleNodeDragging(); break;
                }
                break;

            case GUIModes.ArrowDragging:
                switch (e) {
                    case MouseEvents.Click: this.handleArrowClick(); break;
                    case MouseEvents.Drag: this.handleArrowDrag(); break;
                }
                break;
        }
    }

    handleArrowClick() {
        if (!keyIsPressed) return;

        if (keyIsDown(18)) {
            const sq = this.getSquareAroundMouse();

            if (!sq) return;

            this.deleteConnection(sq.connection);
            return;
        }

        const node = this.getNodeAroundMouse();

        if (!node || (!this.flags.arrowing && node.type === NodeTypes.Reject)) return;

        if (!this.flags.arrowing) {
            if (!this.inputLabels.includes(key)) return;

            this.arrowing.label = key;
            this.arrowing.from = node;
            this.flags.arrowing = true;
            return;
        }

        const newConnection = new Connection(this.arrowing.from, node, this.arrowing.label);

        const existing = this.arrowing.from.out.get(this.arrowing.label);

        if (existing) {
            this.deleteConnection(existing);
        }

        this.arrowing.from.out.set(this.arrowing.label, newConnection);
        this.connections.add(newConnection);
        this.squares.add(newConnection.sq1);
        this.squares.add(newConnection.sq2);

        this.arrowing = {
            label: '',
            from: null
        };

        this.needsDrawUpdate = true;
        this.flags.arrowing = false;
    }

    handleArrowDrag() {
        if (keyIsPressed) return;

        if (!this.flags.dragging) {
            const sq = this.getSquareAroundMouse();
            if (!sq) return;
            this.draggable = sq;
            this.flags.dragging = true;
        }

        this.draggable.updatePosition(mouseX, mouseY);
        this.needsDrawUpdate = true;
    }

    handleNodeDragging() {
        if (keyIsPressed) return;

        if (!this.flags.dragging) {
            const node = this.getNodeAroundMouse();
            if (!node) return;
            this.draggable = node;
            this.flags.dragging = true;
        }

        this.draggable.updatePosition(mouseX, mouseY);
        this.needsDrawUpdate = true;
    }

    handleNodeClick() {
        if (!keyIsPressed) return;

        const node = this.getNodeAroundMouse();

        if (keyIsDown(83)) {
            if (node) node.setType(NodeTypes.Standard);
            else {
                const newNode = new StateNode(this.nextState, 0, 0, NodeTypes.Standard, this.nextState === 0 ? 1 : 0);
                if (this.nextState === 0) {
                    this.playing.current = newNode;
                }
                this.nextState++;
                newNode.updatePosition(mouseX, mouseY);
                this.nodes.add(newNode);
            }

            this.needsDrawUpdate = true;

        } else if (keyIsDown(70)) {
            if (node) node.setType(NodeTypes.Final);
            else {
                const newNode = new StateNode(this.nextState, 0, 0, NodeTypes.Final, this.nextState === 0 ? 1 : 0);
                if (this.nextState === 0) {
                    this.playing.current = newNode;
                }
                this.nextState++;
                newNode.updatePosition(mouseX, mouseY);
                this.nodes.add(newNode);
            }

            this.needsDrawUpdate = true;

        } else if (keyIsDown(82) && !node) {
            const newNode = new StateNode(this.nextReject , 0, 0, NodeTypes.Reject);
            newNode.updatePosition(mouseX, mouseY);
            this.nodes.add(newNode);
            this.nextReject--;

            this.needsDrawUpdate = true;

        } else if (keyIsDown(18) && node) {
            this.deleteNode(node);

            this.needsDrawUpdate = true;
        }

    }

    getNodeAroundMouse() {
        for (const node of this.nodes) {
            if (node.containsMouse()) return node;
        }

        return null;
    }

    getSquareAroundMouse() {
        for (const sq of this.squares) {
            if (sq.mouseIsInside()) return sq;
        }

        return null;
    }

    deleteNode(node) {
        for (const conn of node.out.values()) {
            this.squares.delete(conn.sq1);
            this.squares.delete(conn.sq2);
            this.connections.delete(conn);
        }

        this.nodes.delete(node);

        const nodes = [...this.nodes].filter(nd => nd.type !== NodeTypes.Reject);

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            for (const conn of n.out.values()) {
                if (conn.to === node) this.deleteConnection(conn);
            }
            n.number = i;
            n.setState(0);
        }

        if (nodes[0]) {
            nodes[0].setState(NodeStates.Active);
            this.playing.current = node[0];
        } else {
            this.playing.current = null;
        }

        if (node.type !== NodeTypes.Reject) this.nextState--;

        this.needsDrawUpdate = true;
    }

    deleteConnection(conn) {
        this.connections.delete(conn);
        conn.from.out.delete(conn.label);
        this.squares.delete(conn.sq1);
        this.squares.delete(conn.sq2);

        this.needsDrawUpdate = true;
    }

    draw() {
        textAlign(CENTER, CENTER);
        if (!this.needsDrawUpdate) return;

        background(0);
        for (const conn of [...this.connections]) {
            conn.draw();
        }

        for (const node of [...this.nodes]) {
            node.draw();
        }

        if (this.mode === GUIModes.ArrowDragging) {
            for (const sq of this.squares) {
                sq.draw();
            }
        }

        stroke(strokeColor);
        fill(textFillColor);
        textAlign(LEFT, CENTER);
        text(`Mode: ${this.getMode()}`, 10, 20);
        text(`Char Set: ${this.inputLabels.join('')}`, 10, 50);
        text(`Start: ${this.playInfo.start}`, 10, 80);
        text(`Sub: ${this.playInfo.sub}`, 10, 110);
        text(`End: ${this.playInfo.end}`, 10, 140);

        if (this.flags.playing) {
            text('Playing: ', 200, 20);
            const offset = 320;

            for (let i = 0; i < this.playing.str.length; i++) {
                fill(i === this.playing.ptr - 1 ? activeCharColor : textFillColor);
                text(this.playing.str[i], offset + (30 * i), 20);
            }
        }

        this.needsDrawUpdate = false;
    }

    getMode() {
        switch (this.mode) {
            case GUIModes.NodeDragging: return 'Node';
            case GUIModes.ArrowDragging: return 'Arrow';
        }
    }

    setPlaying(str) {
        if (str.length === 0) {
            this.displayMessage("Please enter a string to play the machine");
            return false;
        }

        const inp = str.replace(/ +/g, '').split('');

        if (!inp.every(elem => this.inputLabels.includes(elem))) {
            this.displayMessage("All characters in the string should be in the Char Set");
            return false;
        }

        if ([...this.nodes].filter(n => n.type !== NodeTypes.Reject).length === 0) {
            this.displayMessage("No state nodes found");
            return false;
        }

        for (const node of this.nodes) {
            if (node.type === NodeTypes.Reject) continue;
            for (const label of this.inputLabels) {
                if (!node.out.has(label)) {
                    this.displayMessage(`State q${node.number} has no output for '${label}'`);
                    return false;
                }
            }
        }

        this.playing.str = inp;
        this.playing.ptr = 0;
        this.flags.playing = true;
        this.displayMessage(`Playing the string '${inp.join('')}'`);
        frameRate(playFrameRate);
        return true;
    }

    checkAndStopPlaying() {
        this.flags.playing = false;
        let str = this.playing.str.join('');

        const hasStart = str.startsWith(this.playInfo.start);
        if (!this.flags.overlap) {
            str = str.slice(this.playInfo.start.length);
        }

        const hasEnd = str.endsWith(this.playInfo.end);
        if (!this.flags.overlap) {
            str = str.slice(0, -(this.playInfo.end.length));
        }

        const hasSubstring = str.includes(this.playInfo.sub);

        const valid = hasStart && hasEnd && hasSubstring;
        const isFinalState = this.playing.current.type === NodeTypes.Final;
        //const isReject = this.playing.current.type === NodeTypes.Reject;
        const machineCorrect = (valid && isFinalState) || (!valid && !isFinalState);

        let msg = `The played string is ${valid ? 'valid' : 'invalid'}. `;
        msg += `The machine halted on a ${this.playing.current.getType()} Node. The machine is ${machineCorrect ? 'correct' : 'wrong'}`;

        this.displayMessage(msg);

        this.playing.current.setState(NodeStates.Inactive);
        const q0 = [...this.nodes].find(n => n.number === 0);
        q0.setState(NodeStates.Active);
        this.playing.current = q0;

        playInp.disabled = false;
        startInp.disabled = false;
        subInp.disabled = false;
        endInp.disabled = false;
        this.needsDrawUpdate = true;
        frameRate(60);
    }

    playStep() {
        if (!this.flags.playing) return;

        if (this.playing.ptr === this.playing.str.length || this.playing.current.type === NodeTypes.Reject) {
            this.checkAndStopPlaying();
            return;
        }

        const nextChar = this.playing.str[this.playing.ptr];

        const nextNode = this.playing.current.out.get(nextChar).to;
        this.playing.current.setState(NodeStates.Inactive);
        nextNode.setState(NodeStates.Active);
        this.playing.current = nextNode;
        this.playing.ptr++;
        this.needsDrawUpdate = true;
    }

    displayMessage(msg) {
        message.innerText = msg;
    }

    keyReleased() {
        if (this.flags.arrowing) {
            this.arrowing = {
                label: '',
                from: null
            }

            this.flags.arrowing = false;
        }
    }

    setMode(mode) {
        this.mode = mode;
        this.needsDrawUpdate = true;
    }

    setStart(str) {
        const inp = str.replace(/ +/g, '').split('');

        if (!inp.every(elem => this.inputLabels.includes(elem))) {
            this.displayMessage("Some character(s) is/are outside the main Character Set");
            return;
        }

        this.playInfo.start = inp.join('');
        this.displayMessage("Start string set");
        this.needsDrawUpdate = true;
    }

    setSubstring(str) {
        const inp = str.replace(/ +/g, '').split('');

        if (!inp.every(elem => this.inputLabels.includes(elem))) {
            this.displayMessage("Some character(s) is/are outside the main Character Set");
            return;
        }

        this.playInfo.sub = inp.join('');
        this.displayMessage("Substring set");
        this.needsDrawUpdate = true;
    }

    setEnd(str) {
        const inp = str.replace(/ +/g, '').split('');

        if (!inp.every(elem => this.inputLabels.includes(elem))) {
            this.displayMessage("Some character(s) is/are outside the main Character Set");
            return;
        }

        this.playInfo.end = inp.join('');
        this.displayMessage("End string set");
        this.needsDrawUpdate = true;
    }

    toJSON() {
        const out = {
            nodes: [],
            connections: [],
            charset: this.inputLabels,
            start: this.playInfo.start,
            sub: this.playInfo.sub,
            end: this.playInfo.end
        };

        for (const node of this.nodes) {
            out.nodes.push({
                number: node.number,
                type: node.type,
                state: node.state,
                posx: node.pos.x,
                posy: node.pos.y
            });
        }

        for (const conn of this.connections) {
            out.connections.push({
                from: conn.from.number,
                to: conn.to.number,
                label: conn.label,
                sq1: {
                    x: conn.sq1.xCenter,
                    y: conn.sq1.yCenter
                },
                sq2: {
                    x: conn.sq2.xCenter,
                    y: conn.sq2.yCenter
                }
            });
        }

        return out;
    }

    fromJSON(json) {
        let inp;

        try {
            inp = JSON.parse(json);
        } catch (e) {
            this.displayMessage("Coudln't parse JSON. Make sure it's valid");
            return false;
        }

        this.reset();

        if (inp.charset.length === 0) return;

        this.inputLabels = inp.charset;
        this.flags.setInputs = true;

        const nodes = [];
        const connections = [];
        const squares = [];
        let num = -999;
        let minNum = Infinity;

        for (const n of inp.nodes) {
            if (n.number > num) {
                num = n.number;
            }
            if (n.number < minNum) {
                minNum = n.number;
            }
            const newNode = new StateNode(n.number, n.posx, n.posy, n.type, n.state);
            nodes.push(newNode);
        }

        for (const c of inp.connections) {
            const fromNode = nodes.find(n => n.number === c.from);
            const toNode = nodes.find(n => n.number === c.to);
            const newConn = new Connection(fromNode, toNode, c.label);
            fromNode.out.set(c.label, newConn);
            newConn.sq1.updatePosition(c.sq1.x, c.sq1.y);
            newConn.sq2.updatePosition(c.sq2.x, c.sq2.y);
            connections.push(newConn);
            squares.push(newConn.sq1);
            squares.push(newConn.sq2);
        }

        this.nodes = new Set(nodes);
        this.connections = new Set(connections);
        this.squares = new Set(squares);

        this.playInfo.start = inp.start || '';
        this.playInfo.sub = inp.sub || '';
        this.playInfo.end = inp.end || '';

        this.playing.current = nodes.find(n => n.number === 0);

        this.nextState = num + 1;
        this.nextReject = minNum - 1;

        charsetInp.disabled = true;
        startInp.disabled = false;
        subInp.disabled = false;
        endInp.disabled = false;
        playInp.disabled = false;
        this.displayMessage("Machine loaded successfully");
        this.needsDrawUpdate = true;
    }
}