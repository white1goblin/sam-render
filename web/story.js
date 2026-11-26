// "The $9.99 Trap" (vertical 1080x1920, 30 fps, 1184 frames). Engine: story_core.js; shots: story_shots.js; timing: timing.js (work/timing.py).
import { finalize } from './story_core.js';
import './story_shots.js';
finalize();
export { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt, overlayAt, SH } from './story_core.js';
