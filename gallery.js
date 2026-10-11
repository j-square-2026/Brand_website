async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  const filterBtns = document.querySelectorAll('.tab-btn');

  let photos = [];

  try {
    const res = await fetch('data/photos.json');
    if (!res.ok) throw new Error('Failed to load photos.json');
    const data = await res.json();
    photos = data.photos || [];
  } catch (err) {
    console.error(err);
    empty.hidden = false;
    return;
  }

  if (photos.length === 0) {
    empty.hidden = false;
    return;
  }

  function render(filter) {
    grid.innerHTML = '';
    const filtered = filter === 'all'
      ? photos
      : photos.filter(p => p.type === filter);

    if (filtered.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    filtered.forEach(item => {
      const card = document.createElement('figure');
      card.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || 'Travel photo';
      img.loading = 'lazy';
      card.appendChild(img);

      if (item.caption || item.location) {
        const cap = document.createElement('figcaption');
        cap.className = 'gallery-caption';

        if (item.caption) {
          const t = document.createElement('span');
          t.className = 'gallery-caption-title';
          t.textContent = item.caption;
          cap.appendChild(t);
        }

        if (item.location) {
          const l = document.createElement('span');
          l.className = 'gallery-caption-loc';
          l.textContent = item.location;
          cap.appendChild(l);
        }

        card.appendChild(cap);
      }

      grid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });

  render('all');
}

loadGallery();