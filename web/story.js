// "Sam — Day 0 to Day 100" (3D long-form, 1920x1080, 30 fps, 18273 frames). Engine: story_core.js; shots: story_shots1-3.js; timing: timing.js (from work/timing_sam.py).
import { finalize } from './story_core.js';
import './story_shots1.js'; import './story_shots2.js'; import './story_shots3.js';
finalize();
export { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt, overlayAt, SH } from './story_core.js';
