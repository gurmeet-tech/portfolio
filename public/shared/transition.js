(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function visibleVideos(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return Array.prototype.filter.call(document.querySelectorAll('video'), function(v){
      var r = v.getBoundingClientRect();
      return r.bottom > 0 && r.top < vh;
    });
  }

  // Waits for every <video> currently in the viewport to be ready to play
  // (readyState >= 3 / HAVE_FUTURE_DATA), or until VIDEO_WAIT_CAP_MS elapses,
  // whichever comes first - so a slow connection or a broken video can never
  // hang the page open indefinitely.
  var VIDEO_WAIT_CAP_MS = 3000;
  var VIDEO_POLL_MS = 60;

  function waitForVisibleVideos(onDone){
    var videos = visibleVideos();
    if (!videos.length){ onDone(); return; }

    var start = Date.now();
    (function poll(){
      var readyCount = videos.filter(function(v){ return v.readyState >= 3 || v.error; }).length;
      if (readyCount === videos.length || (Date.now() - start) >= VIDEO_WAIT_CAP_MS){
        onDone();
      } else {
        setTimeout(poll, VIDEO_POLL_MS);
      }
    })();
  }

  onReady(function(){
    var overlay = document.getElementById('pageTransitionOverlay');
    if (!overlay) return;

    if (document.documentElement.hasAttribute('data-pt-enter')){
      if (reduceMotion){
        document.documentElement.removeAttribute('data-pt-enter');
      } else {
        overlay.classList.add('pt-active','pt-cover');
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            document.documentElement.removeAttribute('data-pt-enter');

            waitForVisibleVideos(function(){
              overlay.classList.add('pt-reveal');
              setTimeout(function(){
                overlay.classList.remove('pt-active','pt-cover','pt-reveal');
              }, 480);
            });
          });
        });
      }
    }

    var internalPagePattern = /^[a-z0-9_-]+\.html(\?[^#]*)?(#.*)?$/i;

    document.addEventListener('click', function(e){
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      var href = link.getAttribute('href');
      if (!href) return;
      if (href.indexOf('#') === 0) return;
      if (href.indexOf('mailto:') === 0) return;
      if (href.indexOf('tel:') === 0) return;
      if (/^https?:\/\//i.test(href) && href.indexOf(location.hostname) === -1) return;

      var bare = href.replace(/^.*\//, '');
      if (!internalPagePattern.test(bare)) return;
      if (reduceMotion) return;

      e.preventDefault();
      try { sessionStorage.setItem('pt-entering', '1'); } catch(err){}

      overlay.classList.add('pt-active');
      requestAnimationFrame(function(){
        overlay.classList.add('pt-cover');
      });

      setTimeout(function(){
        window.location.href = href;
      }, 460);
    });
  });
})();
