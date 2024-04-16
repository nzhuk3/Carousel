# Interactive Carousel(work in progress)
---
This project provides an object-oriented approach to creating an interactive carousel with an animated blob element. It features direction-sensitive animations that adjust based on mouse movement within the carousel's bounds.

### Features

- Interactive Blob Animation: The blob changes its state based on its position relative to the carousel boundaries.
- Directional Control: Users can control the carousel and the blob using mouse movements and clicks.
- Responsive Animation: Blob animations respond dynamically to user interactions, including mouse movements and clicks.
- Customizable Constraints: The carousel and blob animations are customizable through passed constraints, making it flexible for different use cases.

### Classes
#### 1. CursorBlob
The CursorBlob class manages the animated element within the carousel. It handles all animation-related functionalities, including movement, scaling, and rotation based on mouse interactions.


##### Constructor Parameters

- **cursorBlob**:(Element): The DOM element that represents the animated blob.
- **constraints**: An object specifying the vertical and horizontal limits within which the blob can animate.
- **moveSpeed** (Number, optional): The speed at which the blob follows the cursor. Default is 0.2.
- **scaleSpeed** (Number, optional): The speed at which the blob scales. Default is 0.2.
- **rotateSpeed** (Number, optional): The speed at which the blob rotates. Default is 0.2.

##### Methods
- **init()**: Initializes the blob's event listeners and starts the animation.
- **stop()**: Stops the blob's animation and removes event listeners.
- **update()**: Recursively updates the blob's position, scale, and rotation.
- **moveHandler(e)**: Handles mouse movement events.
- **transformElement(element, matrix)**: Applies a transformation matrix to the blob element.
- **getTransformMatrix(scaleX, scaleY, rotationDegrees, translateX, translateY)**: Generates a CSS transformation matrix.
- **getBlobState(mouseX, mouseY)**: Determines the blob's appearance and transformation settings based on the cursor's position relative to the defined constraints.
- **animateBlob(scaleX, scaleY, rotate, scaleSpeed, rotateSpeed)**: Updates the target transformations for the blob and optionally the transformation speeds.

#### 2. Carousel
The Carousel class manages the entire carousel system, including the tracks and individual items. It coordinates with the Blob class to handle animations and interactions.

##### Constructor Parameters

- **container**: The main container of the carousel.
- **blob**: The DOM element representing the blob.

##### Methods
- **init()**: Sets up the carousel, applies initial transformations, and attaches event handlers.
- **handleLeft()**, **handleRight()**, **handleUp()**, **handleDown()**: Methods to navigate the carousel in response to user actions.
- **setpositionX()**, **setpositionY()**: Apply transformations to the carousel's tracks.
- **clickHandler(evt)**: Manages click events within the carousel to navigate or interact with the cursor blob.
- **#unblur(rowIndex, itemIndex) and #blur(rowIndex, itemIndex)**: These methods handle the visual state of carousel items, either adding or removing blur effects. #unblur removes the blur effect to reveal the item clearly, while #blur adds a blur effect to hide the item. These are used internally to control item visibility during navigation interactions.
- **'set onReveal(callback)' and set onHide(callback)** : These setter methods allow for custom callback functions to be defined for item visibility changes. They ensure that the provided callbacks are functions before assigning them to the private properties #onReveal and #onHide.
- **revealItem(rowIndex, itemIndex, callback) and hideItem(rowIndex, itemIndex, callback)** : These methods control the visibility of specific items within the carousel. They use the provided callback functions (or the default ones) to add or remove visual effects such as blurring(by default).

 
### Setup
To use this system in your project:

- Include the carousel and blob HTML structure in your document.
- Ensure your HTML includes elements with the correct classes and IDs as referenced in the JavaScript classes.
- Instantiate the Carousel class when the document is loaded:

```
window.addEventListener("load", function() {
    const carousel = new Carousel(document.querySelector('.carousel-section'), document.getElementById('blob'));
    carousel.init();
});
```

##### Example Usage
```
<div class="carousel-section">
    <div class="track-container">
        <div class="track">
            <div class="carousel-item"></div>
            <!-- More carousel items -->
        </div>
        <!-- More tracks if needed -->
    </div>
</div>
<div id="blob"></div>
```

```
const carousel = new Carousel(document.querySelector('.carousel-section'), document.getElementById('blob'));
carousel.init();
```

### License

This project is open-source and available under the MIT License.