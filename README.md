# Precision Auto Repair — 3D Website

Cinematic interactive automotive website built with **Three.js**, GSAP, and a premium garage experience.

**Live repo:** [joshwilsonnlr/3d-Website](https://github.com/joshwilsonnlr/3d-Website)

## Open locally

Because the 3D models load from the network, serve the folder (do not open `index.html` as a raw file):

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

## GitHub Pages

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)**
4. Site URL: `https://joshwilsonnlr.github.io/3d-Website/`

## What’s included

- Full-screen 3D hero garage (WebGL)
- Real GLB car models (Khronos CarConcept / ToyCar, CC samples)
- Bloom post-processing
- Interactive 3D inspection with 8 hotspots
- Diagnostic scan HUD
- Full workshop props (lifts, cabinets, mechanics, computers, tires)
- Booking form, reviews, contact, SEO schema
- Responsive layout + reduced-motion support

## 3D model credits

- [Khronos glTF Sample Assets — CarConcept](https://github.com/KhronosGroup/glTF-Sample-Assets) (based on a CC0 source)
- [Khronos glTF Sample Assets — ToyCar](https://github.com/KhronosGroup/glTF-Sample-Assets)
