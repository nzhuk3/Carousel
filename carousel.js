

class CursorBlob {
    
    isStopped = false;
    mouseX = 0;
    mouseY = 0;
    posX = 0;
    posY = 0;
    currentScaleX = 1;
    targetScaleX = 1;
    currentScaleY = 1;
    targetScaleY = 1;
    currentRotate = 0;
    targetRotate = 0;

    constructor(cursorBlob, constraints, moveSpeed = 0.2, scaleSpeed = 0.2, rotateSpeed = 0.2) {
        this.cursorBlobEl = cursorBlob;
        this.carouselConstraints = constraints;
        this.moveSpeed = moveSpeed;
        this.scaleSpeed = scaleSpeed;
        this.rotateSpeed = rotateSpeed;
        this.offsetX = cursorBlob.clientWidth / 2;
        this.offsetY = cursorBlob.clientHeight / 2;
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
            return { className: 'redblob', scaleX: 1, scaleY: 1, rotation: 0 };
        }
        if (mouseX < this.carouselConstraints.carouselMiddlePartStartX && this.isInVerticalZone(mouseY)) {
            return { className: 'blueblob', scaleX: 1, scaleY: 1, rotation: -180 };
        }
        if (mouseY <  this.carouselConstraints.carouselMiddlePartStartY) {
            return { className: 'greenblob', scaleX: 1, scaleY: 1, rotation: -90 };
        }
        if (mouseY > this.carouselConstraints.carouselMiddlePartEndY) {
            return { className: 'yellowblob', scaleX: 1, scaleY: 1, rotation: 90 };
        }
    
        return { className: 'whiteblob', scaleX: 1.2, scaleY: 1.2, rotation: 90 };
    }

    moveHandler = (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        const { className, scaleX, scaleY, rotation } = this.getBlobState(e.clientX, e.clientY);
        this.cursorBlobEl.className = className;
        this.animateBlob(scaleX, scaleY, rotation);
    }

    update = () => {
        this.posX += (this.mouseX - this.posX) * this.moveSpeed;
        this.posY += (this.mouseY - this.posY) * this.moveSpeed;
        this.currentScaleX += ((this.targetScaleX - this.currentScaleX) * this.scaleSpeed) ;
        this.currentScaleY += ((this.targetScaleY - this.currentScaleY) * this.scaleSpeed);;
        this.currentRotate += (this.targetRotate - this.currentRotate) * this.rotateSpeed;
        this.currentScaleX -= Math.min(Math.abs(this.mouseY - this.posY) * 0.001, 0.05);
        this.currentScaleY -= Math.min(Math.abs(this.mouseX - this.posX) * 0.001, 0.05);

        this.transformElement(this.cursorBlobEl, this.getTransformMatrix(this.currentScaleX, this.currentScaleY, this.currentRotate, this.posX - this.offsetX, this.posY - this.offsetY));
        if (!this.isStopped) {
            requestAnimationFrame(this.update);
        }
    }

    getTransformMatrix(scaleX, scaleY, rotationDegrees, translateX, translateY) {
        const radians = rotationDegrees * Math.PI / 180;

        const cos = Math.cos(radians).toFixed(4);
        const sin = Math.sin(radians).toFixed(4);

        const matrixValues = [
            cos * scaleX,   
            sin * scaleY,   
            -sin * scaleX,
            cos * scaleY,   
            translateX,   
            translateY    
        ];

        return `matrix(${matrixValues.join(', ')})`;
    }

    animateBlob(scaleX, scaleY, rotate, scaleSpeed = this.scaleSpeed, rotateSpeed = this.rotateSpeed) {
        this.targetRotate = rotate;
        this.rotateSpeed = scaleSpeed;
        this.targetScaleX = scaleX;
        this.targetScaleY = scaleY;
        this.scaleSpeedX = rotateSpeed;
    }

    transformElement(element, matrix) {
        element.style.transform = matrix;
    }
}


class Carousel {

    focusedElementIndex = 0;
    focusedRowIndex = 0;
    slidesToScroll = 1;

    constructor(container, cursorBlob) {
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
        this.cursorBlob = new CursorBlob(cursorBlob, {
            carouselMiddlePartStartX: this.carouselMiddlePartStartX,
            carouselMiddlePartEndX: this.carouselMiddlePartEndX,
            carouselMiddlePartStartY: this.carouselMiddlePartStartY,
            carouselMiddlePartEndY: this.carouselMiddlePartEndY
            });
        this.cursorBlobElement = this.cursorBlob.cursorBlobEl;
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
        } else {
            throw new Error('Assigned value must be a function')
        }
    }

    set onHide(callback) {
        if(typeof callback == 'function') {
            this.#onHide = callback;
        } else {
            throw new Error('Assigned value must be a function')
        }
    }

    revealItem(rowIndex, itemIndex, callback = this.#onReveal) {
        callback(rowIndex, itemIndex)
    }

    hideItem(rowIndex, itemIndex, callback = this.#onHide) {
        callback(rowIndex, itemIndex)
    }

    setPositionX() {
        this.track.style.transform = `translate(${this.positionX}px, 0px)`;
        this.track.dataset.position = this.positionX;
    };

    setPositionY() {
        this.trackContainer.style.transform = `translate(0px, ${this.positionY}px)`;
    };

    init() {
        this.revealItem(this.focusedRowIndex, this.focusedElementIndex);
        this.cursorBlob.init();
        this.setPositionY();
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
            this.setPositionX();
        }
    };
    
    handleRight() {
        if (this.focusedElementIndex < this.itemsCount - 1) {
            this.positionX -= this.movepositionX;
            this.focusedElementIndex += this.slidesToScroll;
            this.track.dataset.index = this.focusedElementIndex;
            this.setPositionX();
        }
    };
    
    handleDown() {
        if (this.focusedRowIndex < this.rowsCount - 1) {
            this.positionY -= this.movepositionY;
            this.focusedRowIndex += this.slidesToScroll;
            this.track = this.tracks[this.focusedRowIndex];
            this.positionX = parseInt(this.track.dataset.position);
            this.focusedElementIndex = parseInt(this.track.dataset.index);
            this.setPositionY();
        }
    };
    
    handleUp() {
        if (this.focusedRowIndex > 0) {
            this.positionY += this.movepositionY;
            this.focusedRowIndex -= this.slidesToScroll;
            this.track = this.tracks[this.focusedRowIndex];
            this.positionX = parseInt(this.track.dataset.position);
            this.focusedElementIndex = parseInt(this.track.dataset.index);
            this.setPositionY();
        }
    };

    clickHandler = (evt) => {
        this.hideItem(this.focusedRowIndex, this.focusedElementIndex);
        switch(this.cursorBlobElement.className) {
            case 'blueblob':
                this.handleLeft();
                break;
            case 'redblob':
                this.handleRight();
                break;
            case 'yellowblob':
                this.handleDown();
                break;
            case 'greenblob':
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

