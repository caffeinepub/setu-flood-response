# Setu Flood Response

## Current State
Fully dark-mode app. Black backgrounds everywhere. No background image.

## Requested Changes (Diff)

### Add
- Flood background image on Landing screen hero

### Modify
- Convert all screens to light mode (white/light gray backgrounds, dark text)
- Keep emergency accent colors (red, yellow, green) unchanged
- Update index.css color-scheme to light

### Remove
- Dark background colors and dark color-scheme

## Implementation Plan
1. Update index.css to light mode OKLCH tokens
2. Update App.tsx root and footer to light
3. Update Nav.tsx to light
4. Update all five screens to light mode
5. Add flood bg image to LandingScreen hero
