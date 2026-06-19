// Custom Cursor
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function tick() {
    cx += (mx - cx) * 0.9;
    cy += (my - cy) * 0.9;
    if(cursor) cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(tick);
}
tick();
