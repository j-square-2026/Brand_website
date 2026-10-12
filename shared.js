(function () {
  'use strict';

  // ============================================
  // EDIT EVERYTHING IN THIS ONE PLACE
  // ============================================
  const EMAIL = 'jsquare.since2026@gmail.com';

  const NAV_ITEMS = [
    { href: 'index.html',   label: 'Home'    },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'watch.html',   label: 'Watch'   },
    { href: 'listen.html',  label: 'Listen'  },
    { href: 'read.html',    label: 'Read'    }
  ];

  // Official Substack logo as inline SVG
  const SUBSTACK_ICON =
    '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-substack">' +
      '<path fill="currentColor" d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>' +
    '</svg>';

  const SOCIALS = [
    { href: 'https://instagram.com/j_square_2026',                                 label: 'Instagram', icon: '<i class="fa-brands fa-instagram"></i>' },
    { href: 'https://youtube.com/@j_square_2026',                                  label: 'YouTube',   icon: '<i class="fa-brands fa-youtube"></i>' },
    { href: 'https://open.spotify.com/user/31hlvkwc7rmkwkpuebzrvo3ckpnq',          label: 'Spotify',   icon: '<i class="fa-brands fa-spotify"></i>' },
    { href: 'https://substack.com/@jsquare2026',                                   label: 'Substack',  icon: SUBSTACK_ICON },
    { href: 'https://jsquare2026.blogspot.com',                                    label: 'Blogger',   icon: '<i class="fa-brands fa-blogger-b"></i>' },
    { href: 'https://x.com/j_square_2026',                                         label: 'X',         icon: '<i class="fa-brands fa-x-twitter"></i>' },
    { href: 'https://www.threads.com/@j_square_2026',                              label: 'Threads',   icon: '<i class="fa-brands fa-threads"></i>' },
    { href: 'https://www.reddit.com/u/j_square_2026/',                             label: 'Reddit',    icon: '<i class="fa-brands fa-reddit-alien"></i>' },
    { href: 'https://discord.com/users/1553832890394087556',                       label: 'Discord',   icon: '<i class="fa-brands fa-discord"></i>' },
    { href: 'mailto:' + EMAIL,                                                     label: 'Email',     icon: '<i class="fa-solid fa-envelope"></i>' }
  ];

  // ============================================
  // RENDER NAV
  // ============================================
  function renderNav() {
    const mount = document.querySelector('[data-component="nav"]');
    if (!mount) return;

    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    const links = NAV_ITEMS.map(function (item) {
      const isActive = item.href.toLowerCase() === current;
      return '<a href="' + item.href + '"' + (isActive ? ' class="active"' : '') + '>' + item.label + '</a>';
    }).join('');

    mount.className = 'nav';
    mount.innerHTML =
      '<div class="container nav-inner">' +
        '<a href="index.html" class="nav-logo">J<sup>2</sup></a>' +
        '<div class="nav-links">' + links + '</div>' +
      '</div>';
  }

  // ============================================
  // RENDER FOOTER
  // ============================================
  function renderFooter() {
    const mount = document.querySelector('[data-component="footer"]');
    if (!mount) return;

    const icons = SOCIALS.map(function (s) {
      const isMail = s.href.indexOf('mailto:') === 0;
      const attrs = isMail
        ? ' aria-label="' + s.label + '" title="' + s.label + '"'
        : ' target="_blank" rel="noopener" aria-label="' + s.label + '" title="' + s.label + '"';
      return '<a href="' + s.href + '"' + attrs + '>' + s.icon + '</a>';
    }).join('');

    mount.className = 'footer';
    mount.innerHTML =
      '<div class="container">' +
        '<div class="footer-socials">' + icons + '</div>' +
        '<p>© 2026 Jenit. All rights reserved.</p>' +
      '</div>';
  }

  // ============================================
  // REPLACE ANY [data-icon="substack"] WITH SVG
  // ============================================
  function upgradeSubstackIcons() {
    document.querySelectorAll('[data-icon="substack"]').forEach(function (el) {
      el.outerHTML = SUBSTACK_ICON;
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    renderNav();
    renderFooter();
    upgradeSubstackIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();