/* Galería de slides en posts: botones anterior y siguiente en escritorio */
(function () {
  var grids = document.querySelectorAll('.article__gallery-grid');
  if (!grids.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  grids.forEach(function (grid) {
    var wrap = document.createElement('div');
    wrap.className = 'article__gallery-wrap';
    grid.parentNode.insertBefore(wrap, grid);
    wrap.appendChild(grid);
    function make(dir, label, glyph) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'article__gallery-btn article__gallery-btn--' + (dir < 0 ? 'prev' : 'next');
      b.setAttribute('aria-label', label);
      b.textContent = glyph;
      b.addEventListener('click', function () {
        var step = grid.clientWidth * 0.88;
        grid.scrollBy({ left: dir * step, behavior: reduce.matches ? 'auto' : 'smooth' });
      });
      wrap.appendChild(b);
      return b;
    }
    var prev = make(-1, 'Slide anterior', '‹');
    var next = make(1, 'Slide siguiente', '›');
    function update() {
      var max = grid.scrollWidth - grid.clientWidth - 2;
      prev.disabled = grid.scrollLeft <= 2;
      next.disabled = grid.scrollLeft >= max;
    }
    grid.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    grid.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    update();
  });
})();
