# RubixMenu

### The greatest leap forward in online ordering since the invention of the web.

Forget everything you know about ordering a pizza. For decades, the industry
has shackled customers to flat, two-dimensional menus — a tragic, linear
experience that utilizes a heartbreaking **0%** of the available spatial
dimensions. **RubixMenu** changes everything.

Powered by a revolutionary **6-Faceted Engagement Surface™**, our patent-adjacent
ordering platform finally lets your customers see *all sides* of the menu —
literally. Every drag, every rotation, every satisfying click of a sticker is
a meticulously optimized micro-interaction engineered to maximize **time on
task**, **dwell**, and what our internal research team calls *"order intent
velocity."*

Why settle for boring conversion when you can deliver **immersive culinary
discovery**? Why click a button when you could solve a puzzle? RubixMenu
transforms the mundane act of buying dinner into a **gamified, kinesthetic
journey** that drives engagement metrics our competitors can only dream of.
Internal A/B tests show a **∞% increase** in the amount of time users spend
in the ordering flow.*

Drag. Rotate. Discover. Order. *(Eventually.)*

> \* Time-to-pizza is, regrettably, also up.

![Demo](docs/demo.gif)

---

## The actual readme starts here

A deliberately awful pizza ordering UI built as a Rubik's cube in Three.js.
Each of the cube's six faces is a different category. Drag to rotate, click
stickers to build your order, then find the **PLACE ORDER** strip on the
bottom face (or use the side panel button if you give up).

No build step — Three.js loads from a CDN via an ES-module importmap.

## Run it

```sh
python -m http.server 8000
# or:  npx serve .
```

Open <http://localhost:8000>. A static file server is required — opening
`index.html` directly via `file://` won't load ES modules.

## Faces

| Face   | Category        |
| ------ | --------------- |
| Front  | Pizzas          |
| Back   | Toppings        |
| Right  | Sizes           |
| Left   | Crusts          |
| Top    | Sides           |
| Bottom | Drinks + Submit |

Toppings, sizes, and crusts attach to the most recently added pizza.
Sides and drinks are their own line items.

## Layout

```
index.html        importmap, canvas, side-panel scaffold
styles.css        HUD + page styling
src/
  main.js         scene, OrbitControls, raycast picking, cart
  cube.js         3x3x3 cubelet group; (face,row,col) <-> mesh mapping
  sticker.js      CanvasTexture builder for one sticker
  menu.js         menu data, one entry per face
  hud.js          DOM order panel (render / confirm / shake / toast)
```
