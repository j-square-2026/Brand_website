(function () {
  'use strict';

  const PREFIX = 'jsquare_';

  // ============================================
  // VISIT COUNTER
  // ============================================
  function initVisitCounter() {
    const el = document.getElementById('visit-counter');
    if (!el) return;

    const countKey = PREFIX + 'visit_count';
    const firstKey = PREFIX + 'first_visit';

    const count = parseInt(localStorage.getItem(countKey) || '0', 10) + 1;
    localStorage.setItem(countKey, count);

    if (!localStorage.getItem(firstKey)) {
      localStorage.setItem(firstKey, new Date().toISOString());
    }

    const firstVisit = new Date(localStorage.getItem(firstKey));
    const daysSince = Math.max(1, Math.floor((Date.now() - firstVisit.getTime()) / 86400000));

    el.innerHTML = `
      <div class="stat-card">
        <i class="fa-solid fa-shoe-prints stat-icon"></i>
        <div class="stat-value">${count}</div>
        <div class="stat-label">${count === 1 ? 'visit' : 'visits'} by you</div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-calendar-day stat-icon"></i>
        <div class="stat-value">${daysSince}</div>
        <div class="stat-label">${daysSince === 1 ? 'day' : 'days'} since you first came</div>
      </div>
    `;
  }

  // ============================================
  // REACTION BUTTONS
  // ============================================
  const REACTIONS = [
    { id: 'like',    label: 'Like',     icon: 'fa-heart' },
    { id: 'fire',    label: 'Fire',     icon: 'fa-fire' },
    { id: 'travel',  label: 'Travel',   icon: 'fa-plane' },
    { id: 'thinking',label: 'Thinking', icon: 'fa-brain' }
  ];

  function initReactions() {
    const container = document.getElementById('reactions');
    if (!container) return;

    container.innerHTML = REACTIONS.map(r => {
      const key = PREFIX + 'reaction_' + r.id;
      const active = localStorage.getItem(key) === 'true';
      return `
        <button class="reaction-btn${active ? ' active' : ''}"
                data-reaction="${r.id}"
                aria-label="${r.label}"
                aria-pressed="${active}">
          <i class="fa-solid ${r.icon}"></i>
          <span>${r.label}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.reaction;
        const key = PREFIX + 'reaction_' + id;
        const isActive = localStorage.getItem(key) === 'true';
        const next = !isActive;
        localStorage.setItem(key, next.toString());
        btn.classList.toggle('active', next);
        btn.setAttribute('aria-pressed', next.toString());
      });
    });
  }

  // ============================================
  // PERSONAL NOTEBOOK
  // ============================================
  function initNotebook() {
    const form = document.getElementById('notebook-form');
    const list = document.getElementById('notebook-list');
    if (!form || !list) return;

    const KEY = PREFIX + 'notes';

    function getNotes() {
      try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
      catch { return []; }
    }

    function saveNotes(notes) {
      localStorage.setItem(KEY, JSON.stringify(notes));
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function render() {
      const notes = getNotes();
      if (notes.length === 0) {
        list.innerHTML = '<p class="notebook-empty">No notes yet. Write your first one above.</p>';
        return;
      }
      list.innerHTML = notes.map((n, i) => `
        <div class="notebook-item">
          <div class="notebook-text">${escapeHtml(n.text)}</div>
          <div class="notebook-meta">
            <span>${new Date(n.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}</span>
            <button class="notebook-delete" data-index="${i}" aria-label="Delete note">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.notebook-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          const notes = getNotes();
          notes.splice(idx, 1);
          saveNotes(notes);
          render();
        });
      });
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="text"]');
      const text = input.value.trim();
      if (!text) return;
      const notes = getNotes();
      notes.unshift({ text, date: new Date().toISOString() });
      if (notes.length > 20) notes.length = 20;
      saveNotes(notes);
      input.value = '';
      render();
    });

    render();
  }

  // ============================================
  // SHARE BUTTONS
  // ============================================
  function initShare() {
    const container = document.getElementById('share-buttons');
    if (!container) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const links = [
      { label: 'WhatsApp', icon: 'fa-whatsapp',     href: `https://wa.me/?text=${title}%20${url}` },
      { label: 'X',        icon: 'fa-x-twitter',    href: `https://twitter.com/intent/tweet?text=${title}&url=${url}` },
      { label: 'LinkedIn', icon: 'fa-linkedin',     href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
      { label: 'Copy',     icon: 'fa-link',         href: '#copy', copy: true }
    ];

    container.innerHTML = links.map(l => `
      <a class="share-btn" href="${l.href}"
         ${l.copy ? '' : 'target="_blank" rel="noopener"'}
         data-label="${l.label}"
         data-copy="${l.copy ? 'true' : 'false'}">
        <i class="fa-brands ${l.icon}"></i>
        <span>${l.label}</span>
      </a>
    `).join('');

    container.querySelectorAll('.share-btn').forEach(btn => {
      if (btn.dataset.copy === 'true') {
        btn.addEventListener('click', e => {
          e.preventDefault();
          navigator.clipboard.writeText(window.location.href).then(() => {
            const original = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => { btn.querySelector('span').textContent = original; }, 1500);
          });
        });
      }
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initVisitCounter();
    initReactions();
    initNotebook();
    initShare();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();