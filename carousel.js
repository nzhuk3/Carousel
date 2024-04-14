

class Blob {
    /**
    * @constructor
    * @param {Element} blob
    */
    
    isStopped = false;
    moveSpeed = 0.4;
    scaleSpeed = 0.2;
    rotateSpeed = 0.2;
    mouseX = 0;
    mouseY = 0; // Текущая позиция мыши
    posX = 0;
    posY = 0; // Текущая позиция элемента
    currentScale = 1; // Текущий размер
    targetScale = 1; // Размер к которому мы стремимся
    currentRotate = 0; // Текущий угол
    targetRotate = 0; // Угол поворота к которому мы стремимся
    
    offsetX = blob.clientWidth / 2;
    offsetY = blob.clientHeight / 2;

    constructor(blob, constraints) {
        this.blobEl = blob;
        this.carouselConstraints = constraints;
    }

    isInVerticalZone(mouseY) {
        return mouseY > this.carouselConstraints.carouselMiddlePartStartY && mouseY < this.carouselConstraints.carouselMiddlePartEndY;
    }

    init() {
        document.body.addEventListener('mousemove', this.moveHandler);
        this.update();
    }
    
    stop() {
        document.body.removeEventListener('mousemove', this.moveHandler);
        this.isStopped = true;
    }

    getBlobState(mouseX, mouseY) {
        if (mouseX > this.carouselConstraints.carouselMiddlePartEndX && this.isInVerticalZone(mouseY)) {
            return { className: 'redblob', scale: 1, rotation: 0 };
        }
        if (mouseX < this.carouselConstraints.carouselMiddlePartStartX && this.isInVerticalZone(mouseY)) {
            return { className: 'blueblob', scale: 1, rotation: -180 };
        }
        if (mouseY <  this.carouselConstraints.carouselMiddlePartStartY) {
            return { className: 'dbblob', scale: 1, rotation: -90 };
        }
        if (mouseY > this.carouselConstraints.carouselMiddlePartEndY) {
            return { className: 'yellowblob', scale: 1, rotation: 90 };
        }
    
        return { className: 'whiteblob', scale: 1.4, rotation: 90 };
    }

    moveHandler = (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        const { className, scale, rotation } = this.getBlobState(e.clientX, e.clientY);
        this.blobEl.className = className;
        this.animateBlob(scale, rotation);
    }

    update = () => {
        this.posX += (this.mouseX - this.posX) * this.moveSpeed;
        this.posY += (this.mouseY - this.posY) * this.moveSpeed;
        this.currentScale += (this.targetScale - this.currentScale) * this.scaleSpeed;
        this.currentRotate += (this.targetRotate - this.currentRotate) * this.rotateSpeed;

        this.transformElement(this.blobEl, this.getTransformMatrix(this.currentScale, this.currentRotate, this.posX - this.offsetX, this.posY - this.offsetY));
        if (!this.isStopped) {
            requestAnimationFrame(this.update);
        }
    }

    getTransformMatrix(scale, rotationDegrees, translateX, translateY) {
        const radians = rotationDegrees * Math.PI / 180;

        const cos = Math.cos(radians).toFixed(4);
        const sin = Math.sin(radians).toFixed(4);

        const matrixValues = [
            cos * scale,    // a
            sin * scale,    // b
            -sin * scale,   // c
            cos * scale,    // d
            translateX,     // tx
            translateY      // ty
        ];

        return `matrix(${matrixValues.join(', ')})`;
    }

    animateBlob(scale, rotate, ss = 0.2, rs = 0.2) {
        this.targetRotate = rotate;
        this.rotateSpeed = ss;
        this.targetScale = scale;
        this.scaleSpeed = rs;
    }

    transformElement(element, matrix) {
        element.style.transform = matrix;
    }
}


class Carousel {
    /**
    * @constructor
    * @param {Element} container
    * @param {Element} blob
    */

    focusedElementIndex = 0;
    focusedRowIndex = 0;
    slidesToScroll = 1;

    constructor(container, blob) {
        this.carousel = container;
        this.carouselRect = this.carousel.getBoundingClientRect();
        this.trackContainer = container.firstElementChild;
        this.tracks = Array.from(this.trackContainer.children);
        this.track = this.tracks[0];
        this.itemRect = this.track.firstElementChild.getBoundingClientRect();
        this.itemsCount = this.track.children.length;
        this.rowsCount = this.tracks.length;
        this.itemWidth = (this.itemRect.width);
        this.itemHeight = (this.itemRect.height);
        this.movepositionX = this.slidesToScroll * this.itemWidth;
        this.movepositionY = this.slidesToScroll * this.itemHeight;
        this.positionX = window.innerWidth / 2 - this.itemRect.width / 2 - this.itemRect.left;
        this.positionY = window.innerHeight / 2 - this.itemRect.height / 2 - this.itemRect.top;
        this.carouselMiddlePartStartX = (window.innerWidth - this.itemWidth) / 2;
        this.carouselMiddlePartEndX = this.carouselMiddlePartStartX + this.itemWidth;
        this.carouselMiddlePartStartY = (this.carousel.clientHeight - this.itemHeight) / 2;
        this.carouselMiddlePartEndY = this.carouselMiddlePartStartY + this.itemHeight;
        this.blob = new Blob(blob, {
            carouselMiddlePartStartX: this.carouselMiddlePartStartX,
            carouselMiddlePartEndX: this.carouselMiddlePartEndX,
            carouselMiddlePartStartY: this.carouselMiddlePartStartY,
            carouselMiddlePartEndY: this.carouselMiddlePartEndY
            });
        this.blobElement = this.blob.blobEl;
    }

    #unblur = (rowIndex, itemIndex) => {
        this.tracks[rowIndex].children[itemIndex].classList.add("enabled");
        this.tracks[rowIndex].children[itemIndex].firstElementChild.firstElementChild.classList.remove("blurred");
    }

    #blur = (rowIndex, itemIndex) => {
        this.tracks[rowIndex].children[itemIndex].classList.remove("enabled");
        this.tracks[rowIndex].children[itemIndex].firstElementChild.firstElementChild.classList.add("blurred");
    }

    #onReveal = this.#unblur;
    #onHide = this.#blur;

    set onReveal(callback) {
        if(typeof callback == 'function') {
            this.#onReveal = callback;
        }
    }

    set onHide(callback) {
        if(typeof callback == 'function') {
            this.#onHide = callback;
        }
    }

    revealItem(rowIndex, itemIndex, callback = this.#onReveal) {
        callback(rowIndex, itemIndex)
    }

    hideItem(rowIndex, itemIndex, callback = this.#onHide) {
        callback(rowIndex, itemIndex)
    }

    setpositionX() {
        this.track.style.transform = `translate(${this.positionX}px, 0px)`;
        this.track.dataset.position = this.positionX;
    };

    setpositionY() {
        this.trackContainer.style.transform = `translate(0px, ${this.positionY}px)`;
    };

    init() {
        this.revealItem(this.focusedRowIndex, this.focusedElementIndex);
        this.blob.init();
        this.setpositionY();
        this.tracks.forEach(track => {
            track.style.transform = `translate(${this.positionX}px, 0px)`;
            track.dataset.position = this.positionX;
            track.dataset.index = 0;
        })
        this.carousel.addEventListener('click', this.clickHandler);
    };

    

    handleLeft()  {
        if (this.focusedElementIndex > 0) {
            this.positionX += this.movepositionX;
            this.focusedElementIndex -= this.slidesToScroll;
            this.track.dataset.index = this.focusedElementIndex;
            this.setpositionX();
        }
    };
    
    handleRight() {
        if (this.focusedElementIndex < this.itemsCount - 1) {
            this.positionX -= this.movepositionX;
            this.focusedElementIndex += this.slidesToScroll;
            this.track.dataset.index = this.focusedElementIndex;
            this.setpositionX();
        }
    };
    
    handleDown() {
        if (this.focusedRowIndex < this.rowsCount - 1) {
            this.positionY -= this.movepositionY;
            this.focusedRowIndex += this.slidesToScroll;
            this.track = this.tracks[this.focusedRowIndex];
            this.positionX = parseInt(this.track.dataset.position);
            this.focusedElementIndex = parseInt(this.track.dataset.index);
            this.setpositionY();
        }
    };
    
    handleUp() {
        if (this.focusedRowIndex > 0) {
            this.positionY += this.movepositionY;
            this.focusedRowIndex -= this.slidesToScroll;
            this.track = this.tracks[this.focusedRowIndex];
            this.positionX = parseInt(this.track.dataset.position);
            this.focusedElementIndex = parseInt(this.track.dataset.index);
            this.setpositionY();
        }
    };

    clickHandler = (evt) => {
        this.hideItem(this.focusedRowIndex, this.focusedElementIndex);
        switch(this.blobElement.className) {
            case 'blueblob':
                this.handleLeft();
                break;
            case 'redblob':
                this.handleRight();
                break;
            case 'yellowblob':
                this.handleDown();
                break;
            case 'dbblob':
                this.handleUp();
                break;
            default:
                console.log('No valid blob class found');
                break;
        }
        this.revealItem(this.focusedRowIndex, this.focusedElementIndex);
    };
} 


window.addEventListener("load", function() {
    const carousel = new Carousel(document.querySelector('.carousel-section'), document.getElementById('blob'));
    carousel.init();
});

