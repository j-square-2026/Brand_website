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
// ARTICLE / BLOG CARD RENDERER
// ============================================
function renderPosts(items, grid, empty, ctaLabel) {
  if (!items || items.length === 0) {
    empty.hidden = false;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('a');
    card.className = 'post-card';
    card.href = item.url;
    card.target = '_blank';
    card.rel = 'noopener';

    if (item.date) {
      const date = document.createElement('span');
      date.className = 'post-date';
      date.textContent = new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      card.appendChild(date);
    }

    const title = document.createElement('h3');
    title.textContent = item.title || 'Untitled';
    card.appendChild(title);

    if (item.description) {
      const desc = document.createElement('p');
      desc.textContent = item.description;
      card.appendChild(desc);
    }

    const more = document.createElement('span');
    more.className = 'post-more';
    more.innerHTML = `${ctaLabel} <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
    card.appendChild(more);

    grid.appendChild(card);
  });
}

// ============================================
// LOAD ARTICLES
// ============================================
async function loadArticles() {
  const grid = document.getElementById('article-grid');
  const empty = document.getElementById('article-empty');

  try {
    const res = await fetch('data/articles.json');
    if (!res.ok) throw new Error('Failed to load articles.json');
    const data = await res.json();
    renderPosts(data.articles || [], grid, empty, 'Read on Substack');
  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

// ============================================
// LOAD BLOGS
// ============================================
async function loadBlogs() {
  const grid = document.getElementById('blog-grid');
  const empty = document.getElementById('blog-empty');

  try {
    const res = await fetch('data/blogs.json');
    if (!res.ok) throw new Error('Failed to load blogs.json');
    const data = await res.json();
    renderPosts(data.blogs || [], grid, empty, 'Read on Blogger');
  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

loadArticles();
loadBlogs();