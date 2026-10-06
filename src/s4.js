
      (() => {
        const topbar = document.querySelector('.topbar');
        if (!topbar) return;
        const menu = topbar.querySelector('.menu');
        const nav = topbar.querySelector('.nav');
        const mobile = window.matchMedia('(max-width: 720px)');

        // Black at rest, liquid glass once the page has moved.
        const syncScrolled = () => topbar.classList.toggle('is-scrolled', (window.scrollY || 0) > 8);
        syncScrolled();
        window.addEventListener('scroll', syncScrolled, { passive: true });

        // Mobile dropdown: class-driven so it can animate in and out.
        const isOpen = () => topbar.classList.contains('is-open');
        const setOpen = (open) => {
          topbar.classList.toggle('is-open', open);
          menu?.setAttribute('aria-expanded', String(open));
          menu?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        };
        menu?.addEventListener('click', () => setOpen(!isOpen()));
        nav?.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
        document.addEventListener('pointerdown', (event) => { if (isOpen() && !topbar.contains(event.target)) setOpen(false); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && isOpen()) { setOpen(false); menu?.focus(); } });
        mobile.addEventListener?.('change', () => setOpen(false));
      })();
    