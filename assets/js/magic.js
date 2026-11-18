/* Magic UI-inspired effects. Adds visuals only; does not touch existing handlers. Load AFTER script.js. */
$(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll progress bar */
  const bar = $('<div id="mg-progress" aria-hidden="true"></div>').appendTo('body')[0];
  let tick = false;
  const upd = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', m > 0 ? Math.min(scrollY / m, 1) : 0); tick = false; };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();

  /* animated backgrounds */
  $('.hero').prepend('<div class="mg-hero-glow" aria-hidden="true"></div><div class="mg-hero-grid" aria-hidden="true"></div>');
  $('#why, #brands').addClass('mg-dark');

  /* border beam + spotlight on cards */
  $('.service-card, .equip, .tile, #inquiry-form').addClass('beam spot');
  if (window.matchMedia('(hover: hover)').matches) {
    $(document).on('pointermove', '.spot', function (e) {
      const r = this.getBoundingClientRect();
      this.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      this.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* blur-fade stagger for sibling .reveal elements */
  $('.reveal').parent().each(function () {
    const kids = $(this).children('.reveal');
    if (kids.length > 1) kids.each((i, el) => el.style.setProperty('--d', (i * 90) + 'ms'));
  });
  $(document).on('transitionend', '.reveal.in', function (e) {
    if (e.originalEvent.propertyName === 'opacity') this.classList.add('done');
  });

  /* text reveal: wrap words, keep the text and spacing exactly as written */
  function split(el) {
    let n = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(p => {
        if (!p) return;
        if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
        else { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', n++); s.textContent = p; frag.appendChild(s); }
      });
      node.replaceWith(frag);
    });
  }
  const h1 = document.querySelector('.hero h1');
  if (h1) { split(h1); setTimeout(() => h1.classList.add('words-in'), 150); }
  const heads = $('main section:not([aria-label]) h2').toArray();
  heads.forEach(split);
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('words-in'); io.unobserve(en.target); } }), { threshold: .3 });
    heads.forEach(h => io.observe(h));
  } else heads.forEach(h => h.classList.add('words-in'));
});
