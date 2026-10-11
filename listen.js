// ============================================
// SPOTIFY AUDIO
// ============================================
async function loadAudio() {
  const grid = document.getElementById('audio-grid');
  const empty = document.getElementById('audio-empty');

  try {
    const res = await fetch('data/audio.json');
    if (!res.ok) throw new Error('Failed to load audio.json');
    const data = await res.json();
    const items = data.audio || [];

    if (items.length === 0) {
      empty.hidden = false;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'audio-card';

      // item.type: "episode" | "track" | "playlist"
      // item.id: the Spotify ID
      const typeMap = {
        episode: 'episode',
        track: 'track',
        playlist: 'playlist'
      };
      const embedType = typeMap[item.type] || 'episode';

      const iframe = document.createElement('iframe');
      iframe.src = `https://open.spotify.com/embed/${embedType}/${item.id}?utm_source=generator&theme=0`;
      iframe.width = '100%';
      iframe.height = item.type === 'playlist' ? '380' : '232';
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      iframe.title = item.title || 'Spotify audio';
      card.appendChild(iframe);

      if (item.title || item.description) {
        const caption = document.createElement('div');
        caption.className = 'audio-caption';

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
  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

loadAudio();