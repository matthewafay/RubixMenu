import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { makeStickerTexture } from './sticker.js';
import { MENU, FACE_COLORS } from './menu.js';

const CUBELET = 0.95;
const SPACING = 1.02;

// BoxGeometry material order: [+X, -X, +Y, -Y, +Z, -Z]
const MAT_TO_FACE = ['right', 'left', 'top', 'bottom', 'front', 'back'];

// For each face: which axis points outward, which world axis is "up" when
// looking at the face from outside, and which is "right" (with optional sign
// flips so reading order top-left -> bottom-right matches the viewer).
const FACE_AXES = {
  front:  { axis: 'z', sign:  1, up: 'y', upSign:  1, right: 'x', rightSign:  1 },
  back:   { axis: 'z', sign: -1, up: 'y', upSign:  1, right: 'x', rightSign: -1 },
  right:  { axis: 'x', sign:  1, up: 'y', upSign:  1, right: 'z', rightSign: -1 },
  left:   { axis: 'x', sign: -1, up: 'y', upSign:  1, right: 'z', rightSign:  1 },
  top:    { axis: 'y', sign:  1, up: 'z', upSign: -1, right: 'x', rightSign:  1 },
  bottom: { axis: 'y', sign: -1, up: 'z', upSign:  1, right: 'x', rightSign:  1 },
};

function cellForCubelet(faceName, x, y, z) {
  const f = FACE_AXES[faceName];
  const coord = { x, y, z };
  const row = 1 - f.upSign * coord[f.up];
  const col = f.rightSign * coord[f.right] + 1;
  return { row, col };
}

export function buildCube() {
  const group = new Group();
  const cubelets = [];
  const lookup = new WeakMap(); // mesh -> { [matIdx]: slotInfo }

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;

        const geo = new BoxGeometry(CUBELET, CUBELET, CUBELET);
        const mats = [];
        const slotInfo = {};
        const coord = { x, y, z };

        for (let mi = 0; mi < 6; mi++) {
          const face = MAT_TO_FACE[mi];
          const f = FACE_AXES[face];
          const isOuter = coord[f.axis] === f.sign;

          if (isOuter) {
            const { row, col } = cellForCubelet(face, x, y, z);
            const item = MENU[face].items[row * 3 + col];
            const color = FACE_COLORS[item.kind] ?? '#888';
            const map = makeStickerTexture({
              name: item.name,
              price: item.price,
              kind: item.kind,
              color,
            });
            const mat = new MeshStandardMaterial({
              map,
              roughness: 0.55,
              metalness: 0.0,
            });
            mats.push(mat);
            if (item.kind !== 'blank') {
              slotInfo[mi] = { face, row, col, item, material: mat };
            }
          } else {
            mats.push(new MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 }));
          }
        }

        const mesh = new Mesh(geo, mats);
        mesh.position.set(x * SPACING, y * SPACING, z * SPACING);
        group.add(mesh);
        cubelets.push(mesh);
        lookup.set(mesh, slotInfo);
      }
    }
  }

  return { group, cubelets, lookup };
}

export function pickInfo(lookup, mesh, materialIndex) {
  const info = lookup.get(mesh);
  if (!info) return null;
  return info[materialIndex] ?? null;
}
