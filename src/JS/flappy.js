function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function CreateBarrier( reverse = false) {
    this.element = newElement ('div', 'barrier');

    const border = newElement ('div', 'barrier-border');
    const body = newElement ('div', 'barrier-body')

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = heigth => body.style.height = `${heigth}px`
}

function PairOfBarriers (height, opening, x) {
    this.element = newElement('div', 'pair-of-barriers');

    this.top = new CreateBarrier(true);
    this.bottom = new CreateBarrier(false);

    this.element.appendChild(this.top.element);
    this.element.appendChild(this.bottom.element);

    this.sortOpening = () => {
        const topHeight = Math.random() * (height - opening);
        const bottomHeight = height - opening - topHeight;
        this.top.setHeight(topHeight);
        this.bottom.setHeight(bottomHeight);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;
    this.getWidth = () => this.element.clientWidth;

    this.sortOpening();
    this.setX(x);
}

function Barriers(height, width, opening, space){
    this.pairs = [
        new PairOfBarriers(height, opening, width),
        new PairOfBarriers(height, opening, width + space),
        new PairOfBarriers(height, opening, width + space * 2),
        new PairOfBarriers(height, opening, width + space * 3),
    ]
    const offSet = 3;
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - offSet);

            if(pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length);
                pair.sortOpening();
            }

            const mid = width / 2;

            const crossMid = pair.getX() + offSet >= mid && pair.getX() < mid;

            if(crossMid) {
                notifyPoint();
            }
        });
    }
}

function Bird(gameLength) {
    let flying = false;

    this.element = newElement ('img', 'bird');
    this.element.src = '/images/bird.png';

    this.getY = () => parseInt(this.element.style.bottom.split ('px') [0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = e => flying = true;
    window.onkeyup = e => flying = false;

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameLength - this.element.clientHeight;

        if(newY <=0){
            this.setY(0);
        } else if ( newY >= maxHeight){
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    }
    this.setY(gameLength/2);
}

