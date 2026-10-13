// ============================================
// SPOTIFY URL PARSER
// ============================================
function parseSpotifyUrl(url) {
  if (!url) return null;
  const match = url.match(/open\.spotify\.com\/(episode|track|playlist|show|album|artist)\/([a-zA-Z0-9]+)/);
  if (match) return { type: match[1], id: match[2] };
  const uriMatch = url.match(/spotify:(episode|track|playlist|show|album|artist):([a-zA-Z0-9]+)/);
  if (uriMatch) return { type: uriMatch[1], id: uriMatch[2] };
  if (/^[a-zA-Z0-9]{20,}$/.test(url)) return { type: 'episode', id: url };
  return null;
}

// ============================================
// FILTER LABELS (for badges on cards)
// ============================================
const FILTER_LABELS = {
  monolog: 'Monolog',
  podcast: 'Podcast',
  story:   'Story',
  song:    'Song',
  music:   'Music'
};

// ============================================
// LOAD + RENDER
// ============================================
let allAudio = [];

async function loadAudio() {
  const grid = document.getElementById('audio-grid');
  const empty = document.getElementById('audio-empty');

  try {
    const res = await fetch('data/audio.json');
    if (!res.ok) throw new Error('Failed to load audio.json');
    const data = await res.json();
    allAudio = data.audio || [];

    if (allAudio.length === 0) {
      empty.hidden = false;
      return;
    }

    // Wire up filter tabs
    const filterBtns = document.querySelectorAll('.tab-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.filter);
      });
    });

    render('all');
  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

function render(filter) {
  const grid = document.getElementById('audio-grid');
  const empty = document.getElementById('audio-empty');

  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? allAudio
    : allAudio.filter(item => item.type === filter);

  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  filtered.forEach(item => {
    const parsed = parseSpotifyUrl(item.url);
    if (!parsed) {
      console.warn('Skipping invalid Spotify URL:', item.url);
      return;
    }

    const card = document.createElement('div');
    card.className = 'audio-card';

    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`;
    iframe.width = '100%';
    iframe.height = (parsed.type === 'playlist' || parsed.type === 'album' || parsed.type === 'show') ? '380' : '232';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.loading = 'lazy';
    iframe.title = item.title || 'Spotify audio';
    card.appendChild(iframe);

    if (item.title || item.description || item.type) {
      const caption = document.createElement('div');
      caption.className = 'audio-caption';

      // Type badge
      if (item.type && FILTER_LABELS[item.type]) {
        const badge = document.createElement('span');
        badge.className = 'post-badge';
        badge.textContent = FILTER_LABELS[item.type];
        caption.appendChild(badge);
      }

      if (item.title) {
        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        caption.appendChild(h3);
      }
      if (item.description) {
        const p = document.createElement('p');
        p.textContent = item.description;
        caption.appendChild(p);
      }
      card.appendChild(caption);
    }

    grid.appendChild(card);
  });
}

loadAudio();