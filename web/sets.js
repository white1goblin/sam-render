// Shared set landmarks (metres, real scale) for world (main.js) and story.js. +y up. Each set has its own origin.
export const HOUSE = [0, 0, 0];      // Sam's house: street along x at z 13..21, front facade z=0, detached garage door at z=-2 (x 6), gravel driveway x 4.4..7.6
export const KIT = [100, 0, 0];      // kitchen interior: 6 x 5 x 2.6, back wall z=-2.5 (sink window), shelf wall x=-3, open side +z
export const GAR = [200, 0, 0];      // garage workshop interior: 6 x 7 x 2.8, workbench at back z=-3.5, roll-up door at z=+3.5
export const MAIN = [300, 0, 0];     // Main Street: street along x at z 8..16, north frontage z=4.5 (diner, office), old gas station (shop) x 12..26 front z=0
export const HOSP = [500, 0, 0];     // hospital room 5 x 5 x 2.7
export const WARE = [600, 0, 0];     // warehouse aisle

export const at = (O, x, y, z) => [O[0] + x, O[1] + y, O[2] + z];

// ---- house exterior ----
export const H_ = {
  door: at(HOUSE, -4.2, 0.45, 0), porch: at(HOUSE, -4.2, 0.45, 1.1), porchChair: at(HOUSE, -5.5, 0.45, 1.2), steps: at(HOUSE, -4.2, 0, 2.6),
  garDoor: at(HOUSE, 6, 0, -2), drive: at(HOUSE, 6, 0, 4), curb: at(HOUSE, 6, 0, 12.6), curbSit: at(HOUSE, 4.6, 0, 12.75), mailbox: at(HOUSE, 3.4, 0, 11.7),
  trailer: at(HOUSE, 6, 0, 5.2), street: at(HOUSE, 0, 0, 17), lawn: at(HOUSE, -4, 0, 7),
};
// ---- kitchen ----
export const K_ = {
  table: at(KIT, 0, 0.76, 0.1), lamp: at(KIT, 0, 1.95, 0.1), shelf: at(KIT, -2.92, 1.55, -0.6), jar: at(KIT, -2.84, 1.585, -0.75), window: at(KIT, -0.3, 1.5, -2.5),
  fridge: at(KIT, 2.2, 0, -2.1), calendar: at(KIT, -2.97, 1.5, 0.9), hallDoor: at(KIT, 2.99, 0, 0.9), toaster: at(KIT, -1.4, 0.92, -2.2), drawer: at(KIT, 1.0, 0.8, -2.2),
  chairN: at(KIT, 0, 0, -0.55), chairS: at(KIT, 0, 0, 0.8), chairW: at(KIT, -1.0, 0, 0.1), chairE: at(KIT, 1.0, 0, 0.1),
};
// ---- garage interior ----
export const G_ = {
  bench: at(GAR, 0, 0.9, -3.05), benchL: at(GAR, -1.3, 0.9, -3.05), stool: at(GAR, -1.9, 0, -1.6), bulb: at(GAR, 0, 2.2, -1.8), board: at(GAR, 2.97, 1.5, -0.6),
  door: at(GAR, 0, 0, 3.5), floorMower: at(GAR, 0.2, 0, -1.4), peg: at(GAR, 0, 1.6, -3.48),
};
// ---- main street ----
export const M_ = {
  diner: at(MAIN, -16, 0, 4.5), dinerIn: at(MAIN, -16, 0, 0), dinerHook: at(MAIN, -11.2, 1.55, -4.6), dinerCounter: at(MAIN, -16, 0, -2.2),
  office: at(MAIN, -5, 0, 4.5), officeDesk: at(MAIN, -5, 0.75, 0.6), lot: at(MAIN, 4.5, 0, 0), lotCar: at(MAIN, 4.5, 0, -1),
  shop: at(MAIN, 19, 0, 0), shopSign: at(MAIN, 10.5, 0, 5), shopCounter: at(MAIN, 14.5, 0, -3.2), shopIn: at(MAIN, 21.5, 0, -4.5), shopDoorSign: at(MAIN, 14.5, 2.75, -0.15),
  bench: (i) => at(MAIN, 18.3 + i * 2.0, 0, -7.6), storage: at(MAIN, -8, 0, 21), gas: at(MAIN, -44, 0, 0), gasKiosk: at(MAIN, -44, 0, -3),
};
// ---- hospital / warehouse ----
export const HO_ = { bed: at(HOSP, 0, 0, -0.8), clock: at(HOSP, 1.2, 2.0, -2.47), window: at(HOSP, -1.0, 1.4, -2.5) };
export const WA_ = { aisle: at(WARE, 0, 0, 0), stack: at(WARE, 1.2, 0, -1.0) };
