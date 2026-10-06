
      (() => {
        const loadVideo = (video) => {
          if (!video || video.src) return;
          const source = video.dataset.videoSrc;
          if (!source) return;
          video.src = source;
          video.closest('.work-media')?.classList.add('is-live');
          video.play().catch(() => {});
        };
        const videos = [...document.querySelectorAll('video[data-video-src]')];
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, io) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) { loadVideo(entry.target); io.unobserve(entry.target); }
            });
          }, { rootMargin: '900px 0px' });
          videos.forEach((video) => observer.observe(video));
        } else videos.forEach(loadVideo);

        const metrics = [...document.querySelectorAll('[data-count-to]')];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const finishMetric = (metric) => {
          const target = Number(metric.dataset.countTo || 0);
          metric.textContent = `${target.toFixed(1)}M+`;
          metric.dataset.counted = 'true';
        };
        const animateMetric = (metric) => {
          if (!metric || metric.dataset.counted === 'true') return;
          if (prefersReducedMotion) { finishMetric(metric); return; }
          const from = Number(metric.dataset.countFrom || 0);
          const target = Number(metric.dataset.countTo || from);
          const duration = 1400;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            metric.textContent = `${(from + ((target - from) * eased)).toFixed(1)}M+`;
            if (progress < 1) requestAnimationFrame(tick);
            else finishMetric(metric);
          };
          requestAnimationFrame(tick);
        };
        if ('IntersectionObserver' in window) {
          const metricObserver = new IntersectionObserver((entries, io) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) { animateMetric(entry.target); io.unobserve(entry.target); }
            });
          }, { threshold: .35 });
          metrics.forEach((metric) => metricObserver.observe(metric));
        } else metrics.forEach(animateMetric);

        const reel = document.querySelector('.hero-reel');
        const scrollCue = document.querySelector('.hero-scroll-cue');
        const hero = document.querySelector('.hero');
        const topbar = document.querySelector('.topbar');
        let reelFramePending = false;
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const updateScrollCue = () => {
          const scrollTop = window.scrollY || window.pageYOffset || 0;
          topbar?.classList.toggle('is-scrolled', scrollTop > 8);
          if (!scrollCue || !hero) return;
          const fadeDistance = Math.max(hero.offsetHeight * .42, 1);
          const progress = clamp(scrollTop / fadeDistance, 0, 1);
          scrollCue.style.opacity = (1 - progress).toFixed(3);
          scrollCue.style.pointerEvents = progress > .98 ? 'none' : 'auto';
        };
        const updateReelTreatment = () => {
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          if (reel) {
            const rect = reel.getBoundingClientRect();
            const fadeStart = viewportHeight * .62;
            const fadeEnd = viewportHeight * .18;
            const reveal = clamp((fadeStart - rect.top) / (fadeStart - fadeEnd), 0, 1);
            const easedReveal = reveal * reveal * (3 - 2 * reveal);
            const strength = 1 - easedReveal;
            const baseBlur = window.innerWidth <= 640 ? 7 : 5;
            reel.style.setProperty('--reel-overlay-strength', strength.toFixed(3));
            reel.style.setProperty('--reel-blur', `${(baseBlur * strength).toFixed(2)}px`);
          }
        };
        const scheduleReelTreatment = () => {
          if (reelFramePending) return;
          reelFramePending = true;
          requestAnimationFrame(() => {
            updateReelTreatment();
            updateScrollCue();
            reelFramePending = false;
          });
        };
        scheduleReelTreatment();
        window.addEventListener('scroll', scheduleReelTreatment, { passive: true });
        window.addEventListener('resize', scheduleReelTreatment);

        const buttons = [...document.querySelectorAll('.filter')];
        const cards = [...document.querySelectorAll('.work-card')];
        buttons.forEach((button) => button.addEventListener('click', () => {
          const filter = button.dataset.filter;
          buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          cards.forEach((card) => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
        }));

      })();
    