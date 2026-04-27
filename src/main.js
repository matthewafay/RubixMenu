import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildCube, pickInfo } from './cube.js';
import { setupHud } from './hud.js';

const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d10);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(5.5, 4.5, 6.5);

scene.add(new THREE.AmbientLight(0xffffff, 0.65));
const dir = new THREE.DirectionalLight(0xffffff, 0.7);
dir.position.set(5, 8, 5);
scene.add(dir);
const fill = new THREE.DirectionalLight(0xffffff, 0.25);
fill.position.set(-6, -3, -4);
scene.add(fill);

const { group: cube, lookup } = buildCube();
scene.add(cube);

const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

resize();
window.addEventListener('resize', resize);

function resize() {
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// --- Cart ---
const cart = {
  lines: [], // { name, basePrice, kind, modifiers: [{name, price, kind}] }
  add(item) {
    if (item.kind === 'pizza' || item.kind === 'side' || item.kind === 'drink') {
      this.lines.push({ name: item.name, basePrice: item.price, kind: item.kind, modifiers: [] });
      return { ok: true };
    }
    if (item.kind === 'topping' || item.kind === 'size' || item.kind === 'crust') {
      const idx = this.lastPizzaIdx();
      if (idx < 0) return { error: 'no-pizza' };
      const line = this.lines[idx];
      if (item.kind === 'size' || item.kind === 'crust') {
        line.modifiers = line.modifiers.filter((m) => m.kind !== item.kind);
      }
      line.modifiers.push({ name: item.name, price: item.price, kind: item.kind });
      return { ok: true };
    }
    return { error: 'unknown' };
  },
  lastPizzaIdx() {
    for (let i = this.lines.length - 1; i >= 0; i--) {
      if (this.lines[i].kind === 'pizza') return i;
    }
    return -1;
  },
  remove(idx) { this.lines.splice(idx, 1); },
  lineTotal(line) {
    return line.basePrice + line.modifiers.reduce((s, m) => s + (m.price || 0), 0);
  },
  subtotal() { return this.lines.reduce((s, l) => s + this.lineTotal(l), 0); },
  clear() { this.lines = []; },
};

const hud = setupHud({
  onPlaceOrder: () => placeOrder(),
  onRemove: (idx) => { cart.remove(idx); hud.render(cart); },
});
hud.render(cart);

// --- Picking ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = null;

canvas.addEventListener('pointerdown', (e) => {
  downPos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('pointerup', (e) => {
  if (!downPos) return;
  const dx = e.clientX - downPos.x;
  const dy = e.clientY - downPos.y;
  downPos = null;
  if (Math.hypot(dx, dy) > 5) return; // it was a drag

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(cube.children, false);
  if (!hits.length) return;
  const h = hits[0];
  const slot = pickInfo(lookup, h.object, h.face.materialIndex);
  if (!slot) return;
  handlePick(slot);
});

function handlePick(slot) {
  const item = slot.item;
  pulse(slot.material);
  if (item.kind === 'submit') {
    placeOrder();
    return;
  }
  const result = cart.add(item);
  if (result.error === 'no-pizza') {
    hud.shake();
    hud.toast('Add a pizza first');
    return;
  }
  hud.render(cart);
}

function pulse(material) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 280);
    const v = Math.sin(t * Math.PI);
    material.emissive.setRGB(v, v, v);
    material.emissiveIntensity = 0.7;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      material.emissive.setRGB(0, 0, 0);
      material.emissiveIntensity = 0;
    }
  };
  requestAnimationFrame(tick);
}

function placeOrder() {
  if (cart.lines.length === 0) {
    hud.shake();
    hud.toast('Cart is empty');
    return;
  }
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  hud.confirm(orderNum);
  setTimeout(() => {
    cart.clear();
    hud.render(cart);
  }, 3000);
}

function loop() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
