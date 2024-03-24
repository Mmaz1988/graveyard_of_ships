/*
The functionality below serves to create a masked map. In essence, the map is a png file, as is the mask.
The mask is provided with a rectangular selection tool that allows you to grdually unveil the map by making the
mask transparent in the selected area.

Three buttons allow you to hide the whole map, clear the whole map, or undo the last selection.

This code doesn't need to be touched since it should remain the same across all maps.
 */

class MapProjection {
    constructor(container, map, map_mask) {
        this.container = container;
        this.init(map,map_mask);
    }


    init(map, map_mask) {
        this.image = this.container.querySelector('.image');
        this.image.src = map;

        console.log("Image", this.image)
        this.canvas = this.container.querySelector('.baseCanvas');
        console.log("Canvas", this.canvas)
        this.selectionCanvas = this.container.querySelector('.selectionCanvas');
        console.log("Selection canvas", this.selectionCanvas)
        this.undoButton = this.container.querySelector('.undoButton');
        this.clearButton = this.container.querySelector('.clearButton');
        this.transparentButton = this.container.querySelector('.transparentButton');

        this.canvasStates = [];
        this.drawing = false;

        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.selectionCtx = this.selectionCanvas.getContext('2d', {willReadFrequently: true});


       // this.backgroundImage.src = map_mask;
        this.backgroundImage = new Image();
        this.backgroundImage.crossOrigin = "anonymous";


        this.backgroundImage.onload = () => {
            console.log("Loaded cover image", this.backgroundImage.width, this.backgroundImage.height, this.backgroundImage.src)
            const newWidth = 1200; // Set the desired width
            const newHeight = 705; // Set the desired height
            const canvasTemp = document.createElement('canvas');
            const ctxTemp = canvasTemp.getContext('2d');

            canvasTemp.width = newWidth;
            canvasTemp.height = newHeight;

            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

            // Draw the image onto the temporary canvas at the new size
             ctxTemp.drawImage(this.backgroundImage, 0, 0, newWidth, newHeight);

            // // Create a pattern from the downscaled canvas
             const pattern = this.ctx.createPattern(canvasTemp, 'repeat');
             this.ctx.fillStyle = pattern;
             console.log("Pattern", pattern)
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveCanvasState();
        };
        // this.backgroundImage.onerror = () => {
        //     console.error("Failed to load the background image.");
        // };

        this.backgroundImage.src = map_mask;
        this.ctx.drawImage(this.backgroundImage, 0, 0, 1200, 705);

        this.canvasStates = [];


        this.saveCanvasState = () => {
            console.log("Saving canvas state")
            this.canvasStates.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
            console.log("Canvas states", this.canvasStates.length)
            console.log("size", this.canvas.width, this.canvas.height);
            console.log("image data", this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        };

        this.restoreCanvasState = () => {
            console.log("Restoring canvas state")
            if (this.canvasStates.length > 1) {
                const previousStates = this.canvasStates.slice(0, -1); // Create a copy of the array without the last element
                const previousState = previousStates[previousStates.length - 1]; // Get the last element from the copy
                this.canvasStates = previousStates; // Update the original array to remove the last element
                this.ctx.putImageData(previousState, 0, 0);
            } else {
                console.log("Canvas hasn't been modified!")
            }
        };

        this.clearCanvas = () => {
            console.log("Clearing canvas")
            this.ctx.globalCompositeOperation = 'source-over';
            const newWidth = 1200; // Set the desired width
            const newHeight = 705; // Set the desired height
            const canvasTemp = document.createElement('canvas');
            const ctxTemp = canvasTemp.getContext('2d');

            canvasTemp.width = newWidth;
            canvasTemp.height = newHeight;

            console.log("background image", this.backgroundImage.width, this.backgroundImage.height, this.backgroundImage.src)

            var element = document.querySelector('.baseCanvas');
            var rect = element.getBoundingClientRect();

            console.log('Element X position: ', rect.left);
            console.log('Element Y position: ', rect.top);
            console.log('Element size: ', element.width, element.height);

            var element1 = document.querySelector('.selectionCanvas');
            var rect1 = element.getBoundingClientRect();

            console.log('Element X position: ', rect1.left);
            console.log('Element Y position: ', rect1.top);
            console.log('Element size: ', element1.width, element1.height);

            // Draw the image onto the temporary canvas at the new size
            ctxTemp.drawImage(this.backgroundImage, 0, 0, newWidth, newHeight);

            // Create a pattern from the downscaled canvas
            const pattern = this.ctx.createPattern(canvasTemp, 'repeat');
            this.ctx.fillStyle = pattern;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };

        this.image.addEventListener('load', () => {
            console.log("Loading image", this.image.width, this.image.height, this.image.src)
            const container = this.container;
            const imgRatio = this.image.width / this.image.height;
            const containerRatio = container.clientWidth / container.clientHeight;
            let displayedWidth, displayedHeight;

            if (imgRatio > containerRatio) {
                displayedWidth = container.clientWidth;
                displayedHeight = displayedWidth / imgRatio;
            } else {
                displayedHeight = container.clientHeight;
                displayedWidth = displayedHeight * imgRatio;
            }

            this.canvas.width = displayedWidth;
            this.canvas.height = displayedHeight;
            this.selectionCanvas.width = displayedWidth;
            this.selectionCanvas.height = displayedHeight;

            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveCanvasState();
        });

        this.drawing = false;

        this.drawSelectionRect = (x, y, width, height) => {
            this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
            this.selectionCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            this.selectionCtx.lineWidth = 1;
            this.selectionCtx.setLineDash([4, 4]);
            this.selectionCtx.strokeRect(x, y, width, height);
        };

        this.selectionCanvas.addEventListener('mousedown', event => {
             this.drawing = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            console.log("selection rect:", this.drawing, this.startX, this.startY)
            console.log("Mouse down:", event.clientX, event.clientY)
        });

        this.selectionCanvas.addEventListener('mousemove', event => {
            if (!this.drawing) return;

            const rect = this.selectionCanvas.getBoundingClientRect();
            const endX = event.clientX;
            const endY = event.clientY;

            const x = Math.min(this.startX, endX) - rect.left;
            const y = Math.min(this.startY, endY) - rect.top;
            const width = Math.abs(endX - this.startX);
            const height = Math.abs(endY - this.startY);

           this.drawSelectionRect(x, y, width, height);
        });
//
        this.selectionCanvas.addEventListener('mouseup', event => {
            if (!this.drawing) return;
            this.drawing = false;

            const rect = this.selectionCanvas.getBoundingClientRect();
            const endX = event.clientX;
            const endY = event.clientY;

            const x = Math.min(this.startX, endX) - rect.left;
            const y = Math.min(this.startY, endY) - rect.top;
            const width = Math.abs(endX - this.startX);
            const height = Math.abs(endY - this.startY);

            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.clearRect(x, y, width, height);

            // Clear the selection rectangle
            this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
            this.saveCanvasState();
        });
//
        // Add the event listeners for the undo and clear buttons
        this.undoButton.addEventListener('click', () => {
            console.log("Undo button clicked");
            this.restoreCanvasState()});
        this.clearButton.addEventListener('click', () => {
            console.log("Clear button clicked");
            this.clearCanvas();
            this.saveCanvasState();
        });

        this.transparentButton.addEventListener('click', () => {
            console.log("Transparent button clicked");
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
    //    this.bindEvents();

        this.restoreCanvasState = this.restoreCanvasState.bind(this);
        this.saveCanvasState = this.saveCanvasState.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.drawSelectionRect = this.drawSelectionRect.bind(this);
    //    this.bindEvents = this.bindEvents.bind(this);

    }
}



function initializeCanvas(map, map_mask, containerId) {
    console.log("Executing map_mask.js");
    console.log('Initializing canvas for map:', containerId);
    var container = document.getElementById(containerId);
    if (container) {
        console.log('Found container:', containerId);
        console.log('Map:', map);
        console.log('Map mask:', map_mask);
        new MapProjection(container, map, map_mask);
    } else {
        console.error('No map container found with ID:', containerId);
    }
}


//     function initializeCanvas(map_mask) {
//     console.log("Initializing canvas");
//     const image = document.getElementById('image');
//     const canvas = document.getElementById('canvas');
//     const ctx = canvas.getContext('2d', {willReadFrequently: true});
//
//     const selectionCanvas = document.getElementById('selectionCanvas');
//     const selectionCtx = selectionCanvas.getContext('2d', {willReadFrequently: true});
//
//
//     const backgroundImage = new Image();
//     backgroundImage.crossOrigin = "anonymous";
//     backgroundImage.src = map_mask;
//
//     backgroundImage.onload = () => {
//         const newWidth = 1200; // Set the desired width
//         const newHeight = 705; // Set the desired height
//         const canvasTemp = document.createElement('canvas');
//         const ctxTemp = canvasTemp.getContext('2d');
//
//         canvasTemp.width = newWidth;
//         canvasTemp.height = newHeight;
//
//         // Draw the image onto the temporary canvas at the new size
//         ctxTemp.drawImage(backgroundImage, 0, 0, newWidth, newHeight);
//
//         // Create a pattern from the downscaled canvas
//         const pattern = ctx.createPattern(canvasTemp, 'repeat');
//         ctx.fillStyle = pattern;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         saveCanvasState();
//     };
//
//     let canvasStates = [];
//
//     const saveCanvasState = () => {
//         canvasStates.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//     };
//
//     const restoreCanvasState = () => {
//         if (canvasStates.length > 1) {
//             const previousStates = canvasStates.slice(0, -1); // Create a copy of the array without the last element
//             const previousState = previousStates[previousStates.length - 1]; // Get the last element from the copy
//             canvasStates = previousStates; // Update the original array to remove the last element
//             ctx.putImageData(previousState, 0, 0);
//         } else
//         {
//             console.log("Canvas hasn't been modified!")
//         }
//     };
//
//     const clearCanvas = () => {
//         ctx.globalCompositeOperation = 'source-over';
//         const newWidth = 1200; // Set the desired width
//         const newHeight = 705; // Set the desired height
//         const canvasTemp = document.createElement('canvas');
//         const ctxTemp = canvasTemp.getContext('2d');
//
//         canvasTemp.width = newWidth;
//         canvasTemp.height = newHeight;
//
//         // Draw the image onto the temporary canvas at the new size
//         ctxTemp.drawImage(backgroundImage, 0, 0, newWidth, newHeight);
//
//         // Create a pattern from the downscaled canvas
//         const pattern = ctx.createPattern(canvasTemp, 'repeat');
//         ctx.fillStyle = pattern;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//     };
//
//     image.addEventListener('load', () => {
//         const container = document.getElementById('container');
//         const imgRatio = image.width / image.height;
//         const containerRatio = container.clientWidth / container.clientHeight;
//         let displayedWidth, displayedHeight;
//
//         if (imgRatio > containerRatio) {
//             displayedWidth = container.clientWidth;
//             displayedHeight = displayedWidth / imgRatio;
//         } else {
//             displayedHeight = container.clientHeight;
//             displayedWidth = displayedHeight * imgRatio;
//         }
//
//         canvas.width = displayedWidth;
//         canvas.height = displayedHeight;
//         selectionCanvas.width = displayedWidth;
//         selectionCanvas.height = displayedHeight;
//
//         ctx.fillStyle = 'rgba(255, 255, 255, 1)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         saveCanvasState();
//     });
//
//     let drawing = false;
//     let startX, startY;
//
//     const drawSelectionRect = (x, y, width, height) => {
//         selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
//         selectionCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
//         selectionCtx.lineWidth = 1;
//         selectionCtx.setLineDash([4, 4]);
//         selectionCtx.strokeRect(x, y, width, height);
//     };
//
//     selectionCanvas.addEventListener('mousedown', event => {
//         drawing = true;
//         startX = event.clientX;
//         startY = event.clientY;
//     });
//
//     selectionCanvas.addEventListener('mousemove', event => {
//         if (!drawing) return;
//
//         const rect = selectionCanvas.getBoundingClientRect();
//         const endX = event.clientX;
//         const endY = event.clientY;
//
//         const x = Math.min(startX, endX) - rect.left;
//         const y = Math.min(startY, endY) - rect.top;
//         const width = Math.abs(endX - startX);
//         const height = Math.abs(endY - startY);
//
//         drawSelectionRect(x, y, width, height);
//     });
//
//     selectionCanvas.addEventListener('mouseup', event => {
//         if (!drawing) return;
//         drawing = false;
//
//         const rect = selectionCanvas.getBoundingClientRect();
//         const endX = event.clientX;
//         const endY = event.clientY;
//
//         const x = Math.min(startX, endX) - rect.left;
//         const y = Math.min(startY, endY) - rect.top;
//         const width = Math.abs(endX - startX);
//         const height = Math.abs(endY - startY);
//
//         ctx.globalCompositeOperation = 'destination-out';
//         ctx.clearRect(x, y, width, height);
//
//         // Clear the selection rectangle
//         selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
//         saveCanvasState();
//     });
//
//     // Add the event listeners for the undo and clear buttons
//     document.getElementById('undoButton').addEventListener('click', restoreCanvasState);
//     document.getElementById('clearButton').addEventListener('click', () => {
//         clearCanvas();
//         saveCanvasState();
//     });
//
//     document.getElementById('transparentButton').addEventListener('click', () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//     });
// }