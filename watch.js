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

    if (target === 'vlogs' && !window._instaLoaded) {
      loadInstagramEmbeds();
    }
  });
});

// ============================================
// YOUTUBE
// ============================================
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

async function loadVideos() {
  const grid = document.getElementById('video-grid');
  const empty = document.getElementById('video-empty');

  try {
    const res = await fetch('data/videos.json');
    if (!res.ok) throw new Error('Failed to load videos.json');
    const data = await res.json();
    const videos = data.videos || [];

    if (videos.length === 0) {
      empty.hidden = false;
      return;
    }

    videos.forEach(video => {
      const videoId = getYouTubeId(video.url);
      if (!videoId) {
        console.warn('Skipping invalid YouTube URL:', video.url);
        return;
      }

      const card = document.createElement('article');
      card.className = 'media-card';

      const thumb = document.createElement('div');
      thumb.className = 'media-thumb';
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', 'Play: ' + video.title);

      const img = document.createElement('img');
      img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      img.alt = video.title;
      img.loading = 'lazy';
      img.onerror = () => {
        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      };
      thumb.appendChild(img);

      const play = document.createElement('span');
      play.className = 'play-btn';
      play.innerHTML = '<i class="fa-solid fa-play"></i>';
      thumb.appendChild(play);

      const playVideo = () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.title = video.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        thumb.innerHTML = '';
        thumb.appendChild(iframe);
        thumb.classList.add('playing');
      };

      thumb.addEventListener('click', playVideo);
      thumb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playVideo();
        }
      });

      card.appendChild(thumb);

      const caption = document.createElement('div');
      caption.className = 'media-caption';

      const title = document.createElement('h3');
      title.textContent = video.title;
      caption.appendChild(title);

      if (video.description) {
        const desc = document.createElement('p');
        desc.textContent = video.description;
        caption.appendChild(desc);
      }

      if (video.date) {
        const date = document.createElement('span');
        date.className = 'media-date';
        date.textContent = new Date(video.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        caption.appendChild(date);
      }

      card.appendChild(caption);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

// ============================================
// INSTAGRAM
// ============================================
let vlogsLoaded = false;

async function loadInstagramEmbeds() {
  if (vlogsLoaded) return;
  vlogsLoaded = true;
  window._instaLoaded = true;

  const grid = document.getElementById('vlog-grid');
  const empty = document.getElementById('vlog-empty');

  if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(script);
  }

  try {
    const res = await fetch('data/vlogs.json');
    if (!res.ok) throw new Error('Failed to load vlogs.json');
    const data = await res.json();
    const vlogs = data.vlogs || [];

    if (vlogs.length === 0) {
      empty.hidden = false;
      return;
    }

    vlogs.forEach(vlog => {
      const wrapper = document.createElement('div');
      wrapper.className = 'vlog-item';

      const blockquote = document.createElement('blockquote');
      blockquote.className = 'instagram-media';
      blockquote.setAttribute('data-instgrm-permalink', vlog.url);
      blockquote.setAttribute('data-instgrm-version', '14');
      blockquote.setAttribute('data-instgrm-captioned', '');
      blockquote.style.margin = '0 auto';
      blockquote.style.maxWidth = '400px';
      blockquote.style.minWidth = '280px';
      blockquote.style.width = '100%';

      wrapper.appendChild(blockquote);
      grid.appendChild(wrapper);
    });

    const processEmbeds = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      } else {
        setTimeout(processEmbeds, 300);
      }
    };
    processEmbeds();

  } catch (err) {
    console.error(err);
    empty.hidden = false;
  }
}

loadVideos();