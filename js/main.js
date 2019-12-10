function app() {
    const bucketButton = document.querySelector('#bucket');
    const pipetteButton = document.querySelector('#pipette');
    const moveButton = document.querySelector('#move');
    const transformButton = document.querySelector('#transform');
    const curColorValue = document.querySelector('#current');
    const prevColorValue = document.querySelector('#previous');
    const colors = document.getElementsByClassName('color');
    const canvas = document.querySelector('#canvas');
    const canvasItems = document.getElementsByClassName('canvas-item');
    const tools = [bucketButton, pipetteButton, moveButton, transformButton];
    const state = {
        currentTool: '',
        currentColor: '',
        previousColor: '',
    };
    const keyCodes = {
        q: 81,
        w: 87,
        e: 69,
        r: 82,
    };

    // tools

    bucketButton.addEventListener('click', bucket);
    pipetteButton.addEventListener('click', pipette);
    moveButton.addEventListener('click', move);
    transformButton.addEventListener('click', transformer);

    function bucket() {
        state.currentTool = 'bucket';
        bucketButton.classList.add('tool--active');
        tools.filter(tool => tool !== bucketButton).forEach(tool => tool.classList.remove('tool--active'));
    }

    function pipette() {
        state.currentTool = 'pipette';
        pipetteButton.classList.add('tool--active');
        tools.filter(tool => tool !== pipetteButton).forEach(tool => tool.classList.remove('tool--active'));
    }

    function move() {
        state.currentTool = 'mover';
        moveButton.classList.add('tool--active');
        tools.filter(tool => tool !== moveButton).forEach(tool => tool.classList.remove('tool--active'));

        mover();
    }

    function mover() {
        canvas.addEventListener('dragstart', e => e.dataTransfer.setData('targetId', e.target.id));
        canvas.addEventListener('dragover', e => e.preventDefault());
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target;
            const dragTargetId = e.dataTransfer.getData('targetId');
            const dragTarget = $(`#${dragTargetId}`)[0];
            const dummy = document.createElement('span');
            dropTarget.before(dummy);
            dragTarget.before(dropTarget);
            dummy.replaceWith(dragTarget);
        });
    }

    function transformer() {
        state.currentTool = 'transformer';
        transformButton.classList.add('tool--active');
        tools.filter(tool => tool !== transformButton).forEach(tool => tool.classList.remove('tool--active'));
    }

    // areas

    [].forEach.call(canvasItems, el => el.addEventListener('click', canvasHandler));

    [].forEach.call(colors, el => el.addEventListener('click', colorsHandler));

    function canvasHandler(e) {
        if (state.currentTool === 'bucket') {
            const color = window.getComputedStyle(document.querySelector('#current')).backgroundColor;
            e.target.style.backgroundColor = color;
        }

        if (state.currentTool === 'transformer') e.target.classList.toggle('circle');
    }

    function colorsHandler(e) {
        if (state.currentTool === 'pipette') {
            const picked = window.getComputedStyle(e.target);
            if (e.target.id === 'previous') {
                const sup = window.getComputedStyle(prevColorValue).backgroundColor;
                state.previousColor = prevColorValue.style.backgroundColor = 
                window.getComputedStyle(curColorValue).backgroundColor;
                state.currentColor = curColorValue.style.backgroundColor = sup;
            } else {
                state.previousColor = prevColorValue.style.backgroundColor = 
                window.getComputedStyle(curColorValue).backgroundColor;
                state.currentColor = curColorValue.style.backgroundColor = picked.backgroundColor;
            }
        }
    }

    // keyboard controls
    
    window.addEventListener('keydown', checkKey, false);

    function checkKey(key) {
        if (key.keyCode === keyCodes.q) bucket();
        if (key.keyCode === keyCodes.w) pipette();
        if (key.keyCode === keyCodes.e) move();
        if (key.keyCode === keyCodes.r) transformer();
    }
}

document.addEventListener('DOMContentLoaded', app);
