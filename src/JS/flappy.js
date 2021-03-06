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

function Barriers(height, width, opening, space, notifyPoint){
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

function Progress(){
    this.element = newElement('span', 'progress');
    this.updatePoints = points => {
        this.element.innerHTML = points;
    }
    this.updatePoints(0);
}

function isOverlap (elementA, elementB){
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
}

function collided(bird, barriers) {
    let collided = false;

    barriers.pairs.forEach(pairOfBarriers => {
        if(!collided) {
            const top = pairOfBarriers.top.element;
            const bottom = pairOfBarriers.bottom.element;

            collided = isOverlap(bird.element, top) || isOverlap(bird.element, bottom);
        }
    });
    return collided;
}

function FlappyBird() {
    let points = 0;

    const gameArea = document.querySelector('[wm-flappy]');
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers (height, width, 200, 400, () => progress.updatePoints(++points));
    const bird = new Bird(height);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate();
            bird.animate();

            if(collided(bird, barriers)){
                clearInterval(timer);
            }
        }, 20);
    }
}

new FlappyBird().start();

