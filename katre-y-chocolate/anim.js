// Injected into poster.html#story; exposes window.setT(seconds) for frame-by-frame rendering.
(() => {
  const $ = s => document.querySelector(s);
  const clamp = v => Math.max(0, Math.min(1, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const out = x => 1 - Math.pow(1 - x, 3);
  const back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const flick = (t, a, b) => t < a ? 0 : t > b ? 1 : ([1,0,1,1,0,0,1,0,1,1][Math.floor((t - a) * 22) % 10]);

  const poster = $('#poster');
  // intro overlay
  const intro = document.createElement('div');
  intro.style.cssText = 'position:absolute;inset:0;z-index:30;background:#070201;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center;padding:0 90px';
  intro.innerHTML = `
    <div id="l1" style="font-family:Montserrat;font-weight:500;font-size:58px;color:#f6dcc0;line-height:1.2">Lo que pasó<br>esa noche…</div>
    <div id="l2" style="font-family:Anton;font-size:84px;letter-spacing:.04em;color:#ff4f72;text-shadow:0 0 20px #ff2d55,0 0 50px #ff2d55;line-height:1.05">NO TE LO VAMOS<br>A CONTAR</div>
    <div id="l3" style="font-family:Montserrat;font-weight:900;font-size:30px;letter-spacing:.4em;color:#ffbf5e">TIENES QUE ESCUCHARLO</div>`;
  poster.appendChild(intro);
  const flash = document.createElement('div');
  flash.style.cssText = 'position:absolute;inset:0;z-index:31;background:#ffe9c7;opacity:0;pointer-events:none';
  poster.appendChild(flash);

  const E = {
    drips: $('.drips'), top: $('.top'), bed: $('.bed'), katre: $('.katre'), y: $('.y'),
    choco: $('.choco-word'), wdrips: $('.word-drips'), sticker: $('.sticker'),
    hookp: $('.hook p'), hookem: $('.hook .em'), player: $('.player'), cta: $('.cta'),
    plat: $('.platforms'), lock: $('.times .lock'), left: $('.times span'), wave: $('#wave'),
  };
  E.left.textContent = '▶ SONANDO';
  E.wdrips.style.transformOrigin = 'top';

  // waveform bars
  const N = 70, W = 700, bw = 6; let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let a = .25 + .45 * Math.sin(t * Math.PI * 1.2) + .3 * rnd();
    if (t > .82) a = Math.min(1, a + .45 * (t - .82) / .18 + .2);
    bars.push({ t, h: Math.max(8, a * 86), x: i * (W / N) });
  }
  function drawWave(p, t) {
    let html = '';
    for (const b of bars) {
      const live = b.t < p ? 1 + .18 * Math.sin(t * 14 + b.x) : 1;
      const h = Math.min(90, b.h * live), y = (92 - h) / 2;
      const fill = b.t < p ? '#ff4f72' : (b.t > .82 ? '#ffbf5e' : 'rgba(255,233,199,.28)');
      html += `<rect x="${b.x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>`;
    }
    html += `<circle cx="${(p * W).toFixed(1)}" cy="46" r="11" fill="#fff" style="filter:drop-shadow(0 0 8px #ff2d55)"/>`;
    E.wave.innerHTML = html;
  }

  window.setT = t => {
    // intro
    $('#l1').style.opacity = seg(t, .3, 1.0);
    $('#l2').style.opacity = seg(t, 1.4, 1.9);
    $('#l2').style.transform = `scale(${1.25 - .25 * out(seg(t, 1.4, 1.9))})`;
    $('#l3').style.opacity = seg(t, 2.2, 2.6);
    intro.style.opacity = 1 - seg(t, 3.0, 3.25);
    flash.style.opacity = t < 3.0 ? 0 : .85 * (1 - seg(t, 3.0, 3.5));

    poster.style.transform = `scale(${1 + .035 * seg(t, 3, 15)})`;
    E.drips.style.transform = `translateY(${-270 * (1 - out(seg(t, 3.1, 4.0)))}px)`;
    E.top.style.opacity = seg(t, 3.5, 4.1);
    const bedOn = flick(t, 3.6, 4.4);
    E.bed.style.opacity = bedOn * (.82 + .13 * Math.sin(t * 3));
    const k = seg(t, 4.1, 4.55);
    E.katre.style.opacity = k > 0 ? 1 : 0;
    E.katre.style.transform = `scale(${1.9 - .9 * out(k)})`;
    E.y.style.opacity = flick(t, 4.8, 5.4);
    const c = out(seg(t, 5.3, 5.9));
    E.choco.style.opacity = c;
    E.choco.style.transform = `translateY(${(1 - c) * 140}px)`;
    E.wdrips.style.transform = `scaleY(${.2 + .8 * out(seg(t, 5.9, 7.2))})`;
    const s = seg(t, 6.6, 7.1);
    E.sticker.style.transform = `rotate(${12 + 3 * Math.sin(t * 4) * s}deg) scale(${s ? back(s) : 0})`;
    E.hookp.style.opacity = seg(t, 7.4, 8.1);
    E.hookp.style.transform = `translateY(${(1 - out(seg(t, 7.4, 8.1))) * 30}px)`;
    E.hookem.style.opacity = seg(t, 8.3, 8.8);
    E.player.style.opacity = seg(t, 8.9, 9.3);
    drawWave(.82 * out(seg(t, 9.3, 12.8)), t);
    E.lock.style.opacity = t > 12.8 ? .55 + .45 * Math.sin((t - 12.8) * 9) ** 2 : 1;
    const cp = seg(t, 11.2, 11.6);
    E.cta.style.transform = `scale(${cp ? back(cp) * (1 + .045 * Math.sin((t - 11.6) * 6) * seg(t, 11.6, 12)) : 0})`;
    E.plat.style.opacity = seg(t, 11.7, 12.3);
  };
})();
