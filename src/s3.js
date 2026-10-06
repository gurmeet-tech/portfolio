
      (() => {
        const setPlaying = (video, playing) => {
          const media = video.closest('.work-media');
          if (!media) return;
          media.classList.toggle('is-playing', playing);
          const btn = media.querySelector('.work-play');
          if (!btn) return;
          const icon = btn.querySelector('i');
          icon?.classList.toggle('fa-play', !playing);
          icon?.classList.toggle('fa-pause', playing);
          btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
        };
        const pauseOthers = (current) => {
          document.querySelectorAll('video[data-video-src]').forEach((video) => {
            if (video !== current) { video.pause(); setPlaying(video, false); }
          });
        };
        const loadVideo = (video) => {
          if (!video || video.src) return;
          const source = video.dataset.videoSrc;
          if (!source) return;
          const media = video.closest('.work-media');
          video.src = source;
          media?.classList.add('is-live');
          if (!media || !media.querySelector('.work-play')) video.play().catch(() => {});
        };
        const videos = [...document.querySelectorAll('video[data-video-src]')];
        const syncMute = (video, btn) => {
          const icon = btn.querySelector('i');
          icon?.classList.toggle('fa-volume-xmark', video.muted);
          icon?.classList.toggle('fa-volume-high', !video.muted);
          btn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        };
        videos.forEach((video) => {
          const media = video.closest('.work-media');
          const btn = media?.querySelector('.work-play');
          btn?.addEventListener('click', () => {
            if (video.paused) { pauseOthers(video); video.play().catch(() => {}); setPlaying(video, true); }
            else { video.pause(); setPlaying(video, false); }
          });
          video.addEventListener('play', () => setPlaying(video, true));
          video.addEventListener('pause', () => setPlaying(video, false));
          if (media && !media.querySelector('.work-mute')) {
            const mute = document.createElement('button');
            mute.type = 'button';
            mute.className = 'work-mute';
            mute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            mute.addEventListener('click', () => {
              if (video.muted) videos.forEach((other) => { if (other !== video) other.muted = true; });
              video.muted = !video.muted;
            });
            video.addEventListener('volumechange', () => syncMute(video, mute));
            media.appendChild(mute);
            syncMute(video, mute);
          }
        });
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, io) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) { loadVideo(entry.target); io.unobserve(entry.target); }
            });
          }, { rootMargin: '900px 0px' });
          videos.forEach((video) => observer.observe(video));
        } else videos.forEach(loadVideo);

        const heroVideo = document.querySelector('.hero-reel video');
        if (heroVideo) {
          const playBtn = document.querySelector('[data-hero-toggle="play"]');
          const muteBtn = document.querySelector('[data-hero-toggle="mute"]');
          const syncHero = () => {
            if (playBtn) {
              const icon = playBtn.querySelector('i');
              icon?.classList.toggle('fa-play', heroVideo.paused);
              icon?.classList.toggle('fa-pause', !heroVideo.paused);
              playBtn.setAttribute('aria-label', heroVideo.paused ? 'Play showreel' : 'Pause showreel');
            }
            if (muteBtn) {
              const icon = muteBtn.querySelector('i');
              icon?.classList.toggle('fa-volume-xmark', heroVideo.muted);
              icon?.classList.toggle('fa-volume-high', !heroVideo.muted);
              muteBtn.setAttribute('aria-label', heroVideo.muted ? 'Unmute showreel' : 'Mute showreel');
            }
          };
          playBtn?.addEventListener('click', () => {
            if (heroVideo.paused) heroVideo.play().catch(() => {});
            else heroVideo.pause();
          });
          muteBtn?.addEventListener('click', () => {
            heroVideo.muted = !heroVideo.muted;
            if (!heroVideo.muted) heroVideo.volume = 1;
          });
          heroVideo.addEventListener('play', syncHero);
          heroVideo.addEventListener('pause', syncHero);
          heroVideo.addEventListener('volumechange', syncHero);
          if (heroVideo.readyState >= 1) syncHero();
          else heroVideo.addEventListener('loadedmetadata', syncHero, { once: true });
        }
        

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
    