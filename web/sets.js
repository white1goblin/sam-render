// Shared set landmarks (metres, real scale) for the world (main.js) and the story. +y up. Each set has its own origin.
export const SHOP = [0, 0, 0];     // boutique: 12 x 10 x 3.4 (x -6..6, z -6..4); hook table front-left, face-out rail mid, mannequin display at the back wall
export const LAB = [100, 0, 0];    // 2003 research office: 6 x 5 x 2.8 (x 97..103, z -2.5..2.5), desk centre, researchers behind it
export const at = (O, x, y, z) => [O[0] + x, O[1] + y, O[2] + z];
// ---- boutique ----
export const S_ = {
  tag: at(SHOP, -1.5, 1.4, 1.2),        // centre of the hanging $9.99 tag (bait), at rest
  table: at(SHOP, -1.4, 0, 1.15),        // display table under the tag (top 0.76)
  cab: at(SHOP, -1.0, 0.76, 1.3),       // little filing cabinet on the table ($9 / $10 drawers)
  shopper0: at(SHOP, -0.7, 0, -0.05),    // shopper's mark at the hook (frame 0)
  disp: at(SHOP, 2.4, 0.2, -4.6),        // mannequin display: platform top y .2, mannequins at x = 2.4 + (-1,0,1)*0.7
  dspX: [1.7, 2.4, 3.1],
  rail: at(SHOP, -2.6, 0, -2.4),         // face-out rail (garments facing +z) x -4.2..-1.0
  counter: at(SHOP, 4.4, 0, 0.6),        // cash desk
};
export const L_ = { desk: at(LAB, 0, 0.75, -0.95), resA: at(LAB, -0.5, 0, -1.62), resB: at(LAB, 0.5, 0, -1.62), cal: at(LAB, -1.6, 1.65, -2.47) };
