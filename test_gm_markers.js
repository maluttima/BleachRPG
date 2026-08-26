const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'mapa_3d_soul_society.html'), 'utf8');

const checks = [
  { name: 'markerEditModal exists in DOM', pass: content.includes('id="markerEditModal"') },
  { name: 'markerDetailModal exists in DOM', pass: content.includes('id="markerDetailModal"') },
  { name: 'Color palette constant exists', pass: content.includes('MARKER_COLOR_PALETTE') },
  { name: 'Structure options (pilar, torii, monolito, cristal, cranio, estandarte)', pass: content.includes('pilar') && content.includes('torii') && content.includes('monolito') && content.includes('cristal') && content.includes('cranio') && content.includes('estandarte') },
  { name: 'openCreateMarkerModal function', pass: content.includes('function openCreateMarkerModal') },
  { name: 'openMarkerDetailsModal function', pass: content.includes('function openMarkerDetailsModal') },
  { name: 'openEditMarkerModal function', pass: content.includes('function openEditMarkerModal') },
  { name: 'deleteMarkerById function', pass: content.includes('function deleteMarkerById') },
  { name: 'clearAllGMMarkersInCurrentWorld function', pass: content.includes('function clearAllGMMarkersInCurrentWorld') },
  { name: 'copyMarkerLoreToClipboard function', pass: content.includes('function copyMarkerLoreToClipboard') },
  { name: 'Raycasting supports isGMMarker', pass: content.includes('hitObject.userData?.isGMMarker') },
  { name: 'Hover tooltip supports isGMMarker', pass: content.includes('isGM && tooltip') },
  { name: 'Animated parts in loop', pass: content.includes('markerGroup.userData.animatedParts') }
];

console.table(checks);
const allPass = checks.every(c => c.pass);
console.log('All GM Marker verification checks passed:', allPass);
if (!allPass) process.exit(1);
