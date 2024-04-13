# Interactive Carousel(work in progress)
---
This project provides an object-oriented approach to creating an interactive carousel with an animated blob element. It features direction-sensitive animations that adjust based on mouse movement within the carousel's bounds.

### Features

- Interactive Blob Animation: The blob changes its state based on its position relative to the carousel boundaries.
- Directional Control: Users can control the carousel and the blob using mouse movements and clicks.
- Responsive Animation: Blob animations respond dynamically to user interactions, including mouse movements and clicks.
- Customizable Constraints: The carousel and blob animations are customizable through passed constraints, making it flexible for different use cases.

### Classes
#### 1. Blob
The Blob class manages the animated element within the carousel. It handles all animation-related functionalities, including movement, scaling, and rotation based on mouse interactions.


##### Constructor Parameters

- **blob**: The DOM element representing the blob.
- **constraints**: An object specifying the vertical and horizontal limits within which the blob can animate.

##### Methods
- **init()**: Initializes the blob's event listeners and starts the animation.
- **stop()**: Stops the blob's animation and removes event listeners.
- **update()**: Recursively updates the blob's position, scale, and rotation.
- **moveHandler(e)**: Handles mouse movement events.
- **transformElement(element, matrix)**: Applies a transformation matrix to the blob element.
- **getTransformMatrix(scale, rotationDegrees, translateX, translateY)**: Generates a CSS transformation matrix.

#### 2. Carousel
The Carousel class manages the entire carousel system, including the tracks and individual items. It coordinates with the Blob class to handle animations and interactions.

##### Constructor Parameters

- **container**: The main container of the carousel.
- **blob**: The DOM element representing the blob.

##### Methods
- **init()**: Sets up the carousel, applies initial transformations, and attaches event handlers.
- **handleLeft()**, **handleRight()**, **handleUp()**, **handleDown()**: Methods to navigate the carousel in response to user actions.
- **setpositionX()**, **setpositionY()**: Apply transformations to the carousel's tracks.
- **clickHandler(evt)**: Manages click events within the carousel to navigate or interact with the blob.

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