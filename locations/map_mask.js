/*
The functionality below serves to create a masked map. In essence, the map is a png file, as is the mask.
The mask is provided with a rectangular selection tool that allows you to grdually unveil the map by making the
mask transparent in the selected area.

Three buttons allow you to hide the whole map, clear the whole map, or undo the last selection.

This code doesn't need to be touched since it should remain the same across all maps.
 */



function initializeCanvas(map_mask) {
    console.log("Initializing canvas");
    const image = document.getElementById('image');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    const selectionCanvas = document.getElementById('selectionCanvas');
    const selectionCtx = selectionCanvas.getContext('2d', {willReadFrequently: true});


    const backgroundImage = new Image();
    backgroundImage.crossOrigin = "anonymous";
    backgroundImage.src = map_mask;

    backgroundImage.onload = () => {
        const newWidth = 1200; // Set the desired width
        const newHeight = 705; // Set the desired height
        const canvasTemp = document.createElement('canvas');
        const ctxTemp = canvasTemp.getContext('2d');

        canvasTemp.width = newWidth;
        canvasTemp.height = newHeight;

        // Draw the image onto the temporary canvas at the new size
        ctxTemp.drawImage(backgroundImage, 0, 0, newWidth, newHeight);

        // Create a pattern from the downscaled canvas
        const pattern = ctx.createPattern(canvasTemp, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
    };

    let canvasStates = [];

    const saveCanvasState = () => {
        canvasStates.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    const restoreCanvasState = () => {
        if (canvasStates.length > 1) {
            const previousStates = canvasStates.slice(0, -1); // Create a copy of the array without the last element
            const previousState = previousStates[previousStates.length - 1]; // Get the last element from the copy
            canvasStates = previousStates; // Update the original array to remove the last element
            ctx.putImageData(previousState, 0, 0);
        } else
        {
            console.log("Canvas hasn't been modified!")
        }
    };

    const clearCanvas = () => {
        ctx.globalCompositeOperation = 'source-over';
        const newWidth = 1200; // Set the desired width
        const newHeight = 705; // Set the desired height
        const canvasTemp = document.createElement('canvas');
        const ctxTemp = canvasTemp.getContext('2d');

        canvasTemp.width = newWidth;
        canvasTemp.height = newHeight;

        // Draw the image onto the temporary canvas at the new size
        ctxTemp.drawImage(backgroundImage, 0, 0, newWidth, newHeight);

        // Create a pattern from the downscaled canvas
        const pattern = ctx.createPattern(canvasTemp, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    image.addEventListener('load', () => {
        const container = document.getElementById('container');
        const imgRatio = image.width / image.height;
        const containerRatio = container.clientWidth / container.clientHeight;
        let displayedWidth, displayedHeight;

        if (imgRatio > containerRatio) {
            displayedWidth = container.clientWidth;
            displayedHeight = displayedWidth / imgRatio;
        } else {
            displayedHeight = container.clientHeight;
            displayedWidth = displayedHeight * imgRatio;
        }

        canvas.width = displayedWidth;
        canvas.height = displayedHeight;
        selectionCanvas.width = displayedWidth;
        selectionCanvas.height = displayedHeight;

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
    });

    let drawing = false;
    let startX, startY;

    const drawSelectionRect = (x, y, width, height) => {
        selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
        selectionCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        selectionCtx.lineWidth = 1;
        selectionCtx.setLineDash([4, 4]);
        selectionCtx.strokeRect(x, y, width, height);
    };

    selectionCanvas.addEventListener('mousedown', event => {
        drawing = true;
        startX = event.clientX;
        startY = event.clientY;
    });

    selectionCanvas.addEventListener('mousemove', event => {
        if (!drawing) return;

        const rect = selectionCanvas.getBoundingClientRect();
        const endX = event.clientX;
        const endY = event.clientY;

        const x = Math.min(startX, endX) - rect.left;
        const y = Math.min(startY, endY) - rect.top;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);

        drawSelectionRect(x, y, width, height);
    });

    selectionCanvas.addEventListener('mouseup', event => {
        if (!drawing) return;
        drawing = false;

        const rect = selectionCanvas.getBoundingClientRect();
        const endX = event.clientX;
        const endY = event.clientY;

        const x = Math.min(startX, endX) - rect.left;
        const y = Math.min(startY, endY) - rect.top;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.clearRect(x, y, width, height);

        // Clear the selection rectangle
        selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
        saveCanvasState();
    });

    // Add the event listeners for the undo and clear buttons
    document.getElementById('undoButton').addEventListener('click', restoreCanvasState);
    document.getElementById('clearButton').addEventListener('click', () => {
        clearCanvas();
        saveCanvasState();
    });

    document.getElementById('transparentButton').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}