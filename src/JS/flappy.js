function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barrier( reverse = false) {
    this.element = newElement ('div', 'barrier');

    const border = newElement ('div', 'barrier-border');
    const body = newElement ('div', 'barrier-body')

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = heigth => body.style.height = `${heigth}px`
}

function PairOfBarriers (height, opening, x) {
    this.element = newElement('div', 'pair-of-barriers');

    this.top = new Barrier(true);
    this.bottom = new Barrier(false);

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

const b = new PairOfBarriers(700, 200, 400);
document.querySelector('[wm-flappy]').appendChild(b.element);