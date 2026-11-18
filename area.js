/* ---------- Area & perimeter ----------
   Count the squares, rows × columns, walk around the edge, perimeter from side lengths,
   which one does the story need, L-shapes, missing sides, and same area with a different
   perimeter. Builds on Arrays and Squares. Uses helpers from app.js and divide.js. */

// a w × h rectangle; grid: draw the unit squares; labels: write the side lengths
function rectSvg(w, h, { grid = true, labels = false, cut = null } = {}) {
  const u = Math.max(w, h) > 8 ? 22 : 28, pad = labels ? 30 : 6, W = w * u + pad + 8, H = h * u + pad + 8;
  const inCut = (x, y) => cut && x >= w - cut[0] && y < cut[1];
  let s = '';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!inCut(x, y)) s += `<rect x="${pad + x * u}" y="${pad + y * u}" width="${u}" height="${u}" class="${grid ? 'ar-cell' : 'ar-fill'}"/>`;
  // outline
  const P = (x, y) => `${pad + x * u},${pad + y * u}`;
  const pts = cut ? [P(0, 0), P(w - cut[0], 0), P(w - cut[0], cut[1]), P(w, cut[1]), P(w, h), P(0, h)] : [P(0, 0), P(w, 0), P(w, h), P(0, h)];
  s += `<polygon points="${pts.join(' ')}" class="ar-edge"/>`;
  if (labels) {
    s += `<text x="${pad + (cut ? (w - cut[0]) : w) * u / 2}" y="${pad - 9}" text-anchor="middle" class="ar-lbl">${cut ? w - cut[0] : w}</text>`;
    s += `<text x="${pad - 9}" y="${pad + h * u / 2 + 6}" text-anchor="end" class="ar-lbl">${h}</text>`;
    if (cut) { s += `<text x="${pad + w * u / 2}" y="${pad + h * u + 22}" text-anchor="middle" class="ar-lbl">${w}</text>`; s += `<text x="${pad + w * u + 8}" y="${pad + (cut[1] + h) * u / 2 + 6}" class="ar-lbl">${h - cut[1]}</text>`; }
  }
  return `<svg class="area" viewBox="0 0 ${W + (cut ? 24 : 0)} ${H + (cut ? 20 : 0)}" width="${W + (cut ? 24 : 0)}" role="img" aria-label="a shape on a grid">${s}</svg>`;
}
// a regular polygon with each side labeled
function sidesSvg(sides) {
  const n = sides.length, c = 100, r = 70, rot = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n);
  const pt = i => [c + r * Math.cos(rot + i * 2 * Math.PI / n), c + r * Math.sin(rot + i * 2 * Math.PI / n)];
  let s = `<polygon points="${sides.map((_, i) => pt(i).map(f1).join(',')).join(' ')}" class="poly"/>`;
  sides.forEach((len, i) => { const [x1, y1] = pt(i), [x2, y2] = pt(i + 1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, k = 1.28; s += `<text x="${f1(c + (mx - c) * k)}" y="${f1(c + (my - c) * k + 6)}" text-anchor="middle" class="ar-lbl">${len}</text>`; });
  return `<svg class="shape" viewBox="0 0 200 200" width="210" role="img" aria-label="a shape with ${n} labeled sides">${s}</svg>`;
}
const AREA_STORIES = {
  perim: [
    (w, h) => `The knights build a fence around a training field ${w} meters long and ${h} meters wide. How many meters of fence do they need?`,
    (w, h) => `The pixies sew ribbon all the way around the edge of a blanket ${w} feet long and ${h} feet wide. How many feet of ribbon do they need?`,
  ],
  area: [
    (w, h) => `The pharaoh's floor is ${w} meters long and ${h} meters wide. Each square tile is 1 meter on each side. How many tiles cover the floor?`,
    (w, h) => `The dragon's garden bed is ${w} feet long and ${h} feet wide. Each square foot needs one seed. How many seeds does it need?`,
  ],
};

function genArea(L) {
  const base = { skill: 'area' };
  switch (L) {
    case 1: {
      const w = rand(2, 6), h = rand(2, 5), A = w * h;
      return { ...base, visual: rectSvg(w, h), ask: 'How many squares cover the shape?', speak: 'How many squares cover the shape? That is its area.', ans: A,
        distract: [[w + h, 'added the sides'], [2 * (w + h), 'counted around the edge'], [A + w, 'counted a row twice'], [A - 1, 'counting slip'], [A + 1, 'counting slip']],
        explain: `${h} rows of ${w} squares: ${h} × ${w} = ${A}. The area is ${A} squares.` };
    }
    case 2: {
      const w = rand(3, 9), h = rand(2, 8), A = w * h;
      return { ...base, visual: rectSvg(w, h, { grid: false, labels: true }), ask: 'What is the area in square units?', speak: `The rectangle is ${w} long and ${h} wide. What is its area?`, ans: A,
        distract: [[w + h, 'added the sides'], [2 * (w + h), 'found the perimeter instead'], [A + w, 'next fact over'], [A - h, 'next fact over']],
        explain: `Area = length × width = ${w} × ${h} = ${A} square units.` };
    }
    case 3: {
      const w = rand(2, 7), h = rand(2, 6), P = 2 * (w + h);
      return { ...base, visual: rectSvg(w, h), ask: 'How many units around the edge?', speak: 'Walk all the way around the edge. How many units long is the edge? That is the perimeter.', ans: P,
        distract: [[w * h, 'found the area instead'], [w + h, 'only counted two sides'], [P - 4, 'counted edge squares, not edges'], [P + 2, 'counting slip'], [P - 2, 'counting slip']].filter(([v]) => v !== P),
        explain: `${w} + ${h} + ${w} + ${h} = ${P}. The perimeter is ${P} units.` };
    }
    case 4: {
      const n = pick([3, 4, 5, 6]);
      if (n === 4) {
        const w = rand(3, 9), h = rand(2, 7), P = 2 * (w + h);
        return { ...base, visual: rectSvg(w, h, { grid: false, labels: true }), story: `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`, ans: P,
          distract: [[w + h, 'only added two sides'], [w * h, 'found the area instead'], [P + 2, 'counting slip'], [w + h + w, 'missed a side']],
          explain: `A rectangle has two sides of ${w} and two sides of ${h}: ${w} + ${h} + ${w} + ${h} = ${P} cm.` };
      }
      const sides = Array.from({ length: n }, () => rand(2, 12)), P = sides.reduce((a, b) => a + b, 0), one = sides[0];
      return { ...base, visual: sidesSvg(sides), ask: 'What is the perimeter?', speak: `Add up all ${n} sides. What is the perimeter?`, ans: P,
        distract: [[P - one, 'missed a side'], [P + one, 'counted a side twice'], [n, 'counted the sides'], [P + 10, 'off by ten'], [P - 1, 'counting slip']],
        explain: `${sides.join(' + ')} = ${P}.` };
    }
    case 5: {
      const kind = rng() < 0.5 ? 'perim' : 'area', w = rand(3, 9), h = rand(2, 8), A = w * h, P = 2 * (w + h);
      if (A === P) return genArea(5);
      return { ...base, sub: kind, story: pick(AREA_STORIES[kind])(w, h), ans: kind === 'area' ? A : P,
        distract: [[kind === 'area' ? P : A, kind === 'area' ? 'found the perimeter instead' : 'found the area instead'], [w + h, 'only added two sides'], [(kind === 'area' ? A : P) + 2, 'counting slip'], [(kind === 'area' ? A : P) - 2, 'counting slip']],
        explain: kind === 'area' ? `Covering the inside is area: ${w} × ${h} = ${A}.` : `Going around the edge is perimeter: ${w} + ${h} + ${w} + ${h} = ${P}.` };
    }
    case 6: {
      const w = rand(4, 7), h = rand(4, 6), cw = rand(1, w - 2), ch = rand(1, h - 2), A = w * h - cw * ch;
      return { ...base, visual: rectSvg(w, h, { labels: true, cut: [cw, ch] }), ask: 'What is the area of this shape?', speak: 'What is the area? Try splitting it into two rectangles.', ans: A,
        distract: [[w * h, 'forgot the missing corner'], [w * h - cw, 'took away too little'], [A + 1, 'counting slip'], [A - 1, 'counting slip'], [2 * (w + h), 'found the perimeter instead']],
        explain: `Split it: a ${w - cw} by ${ch} piece (${(w - cw) * ch}) and a ${w} by ${h - ch} piece (${w * (h - ch)}). ${(w - cw) * ch} + ${w * (h - ch)} = ${A}. Or: ${w} × ${h} = ${w * h}, take away the missing ${cw} × ${ch} corner = ${A}.` };
    }
    case 7: {
      const w = rand(2, 9), h = rand(2, 9);
      if (rng() < 0.5) { const A = w * h; return { ...base, sub: 'missing-area', story: `A rectangle has an area of ${A} square units. One side is ${w} long. How long is the other side?`, ans: h,
        distract: [[A - w, 'took away instead of dividing'], [A, 'copied the area'], [h + 1, 'next fact over'], [h - 1, 'next fact over'], [w, 'copied the side']],
        explain: `${w} × ? = ${A}. ${A} ÷ ${w} = ${h}.` }; }
      const P = 2 * (w + h);
      return { ...base, sub: 'missing-perim', story: `A rectangle has a perimeter of ${P} units. One side is ${w} long. How long is the other side?`, ans: h,
        distract: [[P - w, 'took away only one side'], [P - 2 * w, 'forgot to halve'], [P / 2, 'only halved'], [h + 1, 'counting slip']].filter(([v]) => v !== h),
        explain: `Half the perimeter is one long side plus one short side: ${P} ÷ 2 = ${w + h}. ${w + h} − ${w} = ${h}.` };
    }
    default: {
      const A = pick([12, 16, 18, 24, 36]), pairs = factorsOf(A).filter(f => f * f <= A && f > 1).map(f => [f, A / f]);
      if (pairs.length < 2) return genArea(8);
      const [p1, p2] = shuffle(pairs).slice(0, 2), per = ([a, b]) => 2 * (a + b), long = per(p1) > per(p2) ? p1 : p2, lbl = ([a, b]) => `${b} by ${a}`;
      return { ...base, visual: `<div class="frac-pair">${rectSvg(p1[1], p1[0], { labels: true, grid: false })}${rectSvg(p2[1], p2[0], { labels: true, grid: false })}</div>`,
        story: `Both gardens have an area of ${A} square meters: one is ${lbl(p1)}, the other is ${lbl(p2)}. Which needs more fence to go around it?`, ans: lbl(long),
        choices: [{ v: lbl(long), ok: true }, { v: lbl(long === p1 ? p2 : p1), tag: 'thought same area means same perimeter' }, { v: 'They need the same', tag: 'thought same area means same perimeter' }],
        explain: `${lbl(p1)}: ${p1[1]} + ${p1[0]} + ${p1[1]} + ${p1[0]} = ${per(p1)}. ${lbl(p2)}: ${per(p2)}. Same area, but the long, thin one has the longer edge.` };
    }
  }
}
