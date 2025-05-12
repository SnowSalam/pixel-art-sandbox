const grid = document.getElementById('grid');
const colorPicker = document.getElementById('color-picker');
const inputWidth = document.getElementById('cells-wide');
const inputHeight = document.getElementById('cells-height');
const controlButton = document.getElementById('control-button');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
const canvas = document.getElementById('canvas');

controlButton.addEventListener('click', () => {
    if ('toggleAttribute' in HTMLElement.prototype) {
        document.querySelector('#control-button img').classList.toggle('active');
        document.querySelector('.control-box').toggleAttribute('hidden');
    } else {
        HTMLElement.prototype.toggleAttribute = function(attr) {
          if (this.hasAttribute(attr)) {
            this.removeAttribute(attr);
          } else {
            this.setAttribute(attr, '');
          }
        };
    }
});

let isMouseDown = false;

document.body.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
});

function createGrid(width, height) {
    grid.innerHTML = '';

    let pixelSize = Math.min(
        document.documentElement.clientWidth / width,
        document.documentElement.clientHeight / height
    );

    grid.style.gridTemplateRows = `repeat(${height}, ${pixelSize}px)`;
    grid.style.gridTemplateColumns = `repeat(${width}, ${pixelSize}px)`;
    

    for (let i = 0; i < width * height; ++i) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');

        pixel.style.width = pixelSize;
        pixel.style.height = pixelSize;

        pixel.addEventListener('mousedown', () => {
            pixel.style.backgroundColor = colorPicker.value;
        });

        pixel.addEventListener('mouseover', () => {
            if (isMouseDown) {
                pixel.style.backgroundColor = colorPicker.value;
            }
        });

        grid.appendChild(pixel);
    }
}

inputWidth.addEventListener('change', () => {
    createGrid(+inputWidth.value, +inputHeight.value);
});

inputHeight.addEventListener('change', () => {
    createGrid(+inputWidth.value, +inputHeight.value);
});

clearButton.addEventListener('click', () => {
    createGrid(+inputWidth.value, +inputHeight.value);
});

saveButton.addEventListener('click', () => {
    const width = +inputWidth.value;
    const height = +inputHeight.value;

    let pixel = document.querySelector('.pixel');
    let pixelStyle = window.getComputedStyle(pixel);
    const cellSize = parseInt(pixelStyle.width, 10);

    canvas.width = width * cellSize;
    canvas.height = width * cellSize;

    pixel = null;
    pixelStyle = null;

    const ctx = canvas.getContext('2d');

    const pixels = document.querySelectorAll('.pixel');

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const pixel = pixels[row * width + col];
            const color = window.getComputedStyle(pixel).backgroundColor;
            ctx.fillStyle = color;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

createGrid(32, 32);