// ============================================
// TAB SWITCHING
// ============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ============================================
// CARD RENDERER
// ============================================
function renderPosts(items, grid, empty, ctaLabel, platform) {
  if (!items || items.length === 0) {
    empty.hidden = false;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('a');
    card.className = 'post-card post-card-rich';
    card.href = item.url;
    card.target = '_blank';
    card.rel = 'noopener';

    // Image (from JSON if provided, else skip)
    if (item.image) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'post-image';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      img.loading = 'lazy';
      img.onerror = () => { imgWrap.style.display = 'none'; };
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);
    }

    const body = document.createElement('div');
    body.className = 'post-body';

    // Platform badge
    const badge = document.createElement('span');
    badge.className = 'post-badge';
    badge.textContent = platform;
    body.appendChild(badge);

    // Date
    if (item.date) {
      const date = document.createElement('span');
      date.className = 'post-date';
      date.textContent = new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      body.appendChild(date);
    }

    // Title
    const title = document.createElement('h3');
    title.textContent = item.title || 'Untitled';
    body.appendChild(title);

    // Description
    if (item.description) {
      const desc = document.createElement('p');
      desc.textContent = item.description;
      body.appendChild(desc);
    }

    // CTA
    const more = document.createElement('span');
    more.className = 'post-more';
    more.innerHTML = `${ctaLabel} <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
    body.appendChild(more);

    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================
// LOADERS
// ============================================
async function loadArticles() {
  const grid = document.getElementById('article-grid');
  const empty = document.getElementById('article-empty');
  try {
    const res = await fetch('data/articles.json');
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    renderPosts(data.articles || [], grid, empty, 'Read on Substack', 'Substack');
  } catch (err) { console.error(err); empty.hidden = false; }
}

async function loadBlogs() {
  const grid = document.getElementById('blog-grid');
  const empty = document.getElementById('blog-empty');
  try {
    const res = await fetch('data/blogs.json');
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    renderPosts(data.blogs || [], grid, empty, 'Read on Blogger', 'Blogger');
  } catch (err) { console.error(err); empty.hidden = false; }
}

loadArticles();
loadBlogs();