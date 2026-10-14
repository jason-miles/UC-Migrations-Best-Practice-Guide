(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('uc-theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
  $('#theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('uc-theme', next);
  });

  // Reading progress
  const bar = $('#progress span');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scrollspy
  const links = new Map($$('.sidebar nav a').map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('active'));
      links.get(e.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  $$('section.step').forEach(s => spy.observe(s));

  // Sidebar filter
  $('#filter').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $$('.sidebar nav li').forEach(li => {
      const sec = document.getElementById(li.firstElementChild.getAttribute('href').slice(1));
      const hit = !q || sec.textContent.toLowerCase().includes(q);
      li.classList.toggle('hide', !hit);
    });
  });

  // Copy buttons
  $$('pre').forEach(pre => {
    const b = document.createElement('button');
    b.className = 'copy'; b.type = 'button'; b.textContent = 'Copy';
    b.addEventListener('click', async () => {
      await navigator.clipboard.writeText(pre.innerText.replace(/\nCopy$/, ''));
      b.textContent = 'Copied'; setTimeout(() => (b.textContent = 'Copy'), 1400);
    });
    pre.appendChild(b);
  });

  // Persisted checklists
  $$('ul.check input').forEach((box, i) => {
    const key = 'uc-chk-' + i;
    box.checked = localStorage.getItem(key) === '1';
    box.addEventListener('change', () => {
      localStorage.setItem(key, box.checked ? '1' : '0');
      tally();
    });
  });
  function tally() {
    const all = $$('ul.check input');
    const done = all.filter(b => b.checked).length;
    $('#tally').textContent = `${done} / ${all.length} checklist items complete`;
  }
  tally();
  $('#reset').addEventListener('click', () => {
    $$('ul.check input').forEach((b, i) => { b.checked = false; localStorage.removeItem('uc-chk-' + i); });
    tally();
  });

  // Path chooser
  const advice = {
    'external|delta|any': ['<span class="tag rec">Recommended</span> <code>SYNC</code> (or the upgrade wizard) into a UC <strong>external</strong> table. Metadata-only, re-runnable, no data copied.', 'step-4'],
    'external|serde|any': ['<span class="tag warn">Convert first</span> Hive SerDe tables fail SYNC with <code>UPGRADE_NOT_SUPPORTED.HIVE_SERDE</code>. Run <code>CONVERT TO DELTA</code>, then <code>SYNC</code>.', 'step-4'],
    'managed|delta|dbfsroot': ['<span class="tag rec">Recommended</span> <code>DEEP CLONE</code> into a UC <strong>managed</strong> table (SYNC cannot copy managed tables stored in workspace DBFS root). Use CTAS if clone prerequisites are not met.', 'step-4'],
    'managed|delta|external-storage': ['<span class="tag rec">Recommended</span> <code>SYNC</code> can register these as UC <strong>external</strong> tables. Use <code>DEEP CLONE</code> if the target must be UC managed.', 'step-4'],
    'managed|serde|any': ['<span class="tag warn">CTAS</span> Not Delta or Parquet, so clone prerequisites fail. Rewrite with <code>CREATE TABLE AS SELECT</code> into a Delta UC table.', 'step-4'],
    'view|any|any': ['<span class="tag alt">Manual</span> Recreate views <em>after</em> every referenced table is migrated, using three-level names (<code>catalog.schema.table</code>).', 'step-4']
  };
  const pick = () => {
    const t = $('#c-type').value, f = $('#c-fmt').value, l = $('#c-loc').value;
    const hit = advice[`${t}|${f}|${l}`] || advice[`${t}|${f}|any`] || advice[`${t}|any|any`];
    $('#verdict').innerHTML = hit
      ? hit[0] + ` <a href="#${hit[1]}">See Step 4 details</a>`
      : 'Select a table type, format and location above.';
  };
  ['c-type', 'c-fmt', 'c-loc'].forEach(id => $('#' + id).addEventListener('change', pick));
  pick();
})();
