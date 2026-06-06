(function () {
  'use strict';

  /* ============================================
     DOM References
     ============================================ */
  const menuBtn = document.getElementById('menuBtn');
  const navOverlay = document.getElementById('navOverlay');
  const scrollNav = document.getElementById('scrollNav');
  const passportTrack = document.getElementById('passportTrack');
  const passportWrapper = passportTrack?.parentElement;
  const atlasCard = document.getElementById('atlasCard');
  const markers = document.querySelectorAll('.marker');
  const philosophyPanels = document.querySelectorAll('.philosophy__panel');
  const letterFolds = document.querySelectorAll('.letter__fold');
  const navLinks = document.querySelectorAll('[data-nav]');

  /* ============================================
     Atlas Destination Data
     ============================================ */
  const destinations = {
    morocco: {
      title: 'Morocco',
      image: 'https://images.unsplash.com/photo-1569387330634-7d1a1700661c?w=600&q=80',
      duration: '12 days',
      type: 'Desert & Culture',
      season: 'October – March'
    },
    kyoto: {
      title: 'Kyoto',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e712f0eb?w=600&q=80',
      duration: '10 days',
      type: 'Temples & Gastronomy',
      season: 'March – May'
    },
    patagonia: {
      title: 'Patagonia',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
      duration: '14 days',
      type: 'Expedition & Wilderness',
      season: 'November – February'
    },
    cappadocia: {
      title: 'Cappadocia',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
      duration: '8 days',
      type: 'Heritage & Ballooning',
      season: 'April – June'
    },
    iceland: {
      title: 'Iceland',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
      duration: '9 days',
      type: 'Aurora & Geothermal',
      season: 'September – March'
    },
    zanzibar: {
      title: 'Zanzibar',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
      duration: '11 days',
      type: 'Coastal & Spice Trade',
      season: 'June – October'
    }
  };

  /* ============================================
     Menu Toggle
     ============================================ */
  function toggleMenu(open) {
    const isOpen = open ?? !navOverlay.classList.contains('is-open');
    navOverlay.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    navOverlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn?.addEventListener('click', () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });

  /* ============================================
     Scroll Navigation Visibility
     ============================================ */
  let lastScrollY = 0;

  function handleScrollNav() {
    const scrollY = window.scrollY;
    const openingHeight = document.getElementById('opening')?.offsetHeight ?? 600;

    if (scrollY > openingHeight * 0.6) {
      scrollNav?.classList.add('is-visible');
    } else {
      scrollNav?.classList.remove('is-visible');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScrollNav, { passive: true });
  handleScrollNav();

  /* ============================================
     Passport Strip — Drag to Scroll
     ============================================ */
  if (passportWrapper) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let momentum = 0;
    let animationId = null;

    passportWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      passportWrapper.classList.add('is-dragging');
      startX = e.pageX - passportWrapper.offsetLeft;
      scrollLeft = passportWrapper.scrollLeft;
      cancelAnimationFrame(animationId);
    });

    passportWrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - passportWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      momentum = walk - (passportWrapper.scrollLeft - scrollLeft);
      passportWrapper.scrollLeft = scrollLeft - walk;
    });

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      passportWrapper.classList.remove('is-dragging');

      let velocity = momentum * 0.3;
      const decay = () => {
        if (Math.abs(velocity) < 0.5) return;
        passportWrapper.scrollLeft += velocity;
        velocity *= 0.95;
        animationId = requestAnimationFrame(decay);
      };
      decay();
    };

    passportWrapper.addEventListener('mouseup', stopDrag);
    passportWrapper.addEventListener('mouseleave', stopDrag);

    passportWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - passportWrapper.offsetLeft;
      scrollLeft = passportWrapper.scrollLeft;
    }, { passive: true });

    passportWrapper.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - passportWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      passportWrapper.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  }

  /* Passport stamp animation on hover */
  document.querySelectorAll('.stamp').forEach((stamp) => {
    stamp.addEventListener('mouseenter', () => {
      stamp.classList.add('is-stamped');
    });
    stamp.addEventListener('mouseleave', () => {
      stamp.classList.remove('is-stamped');
    });
    stamp.addEventListener('focus', () => stamp.classList.add('is-stamped'));
    stamp.addEventListener('blur', () => stamp.classList.remove('is-stamped'));
  });

  /* ============================================
     Philosophy Panels — Intersection Observer
     ============================================ */
  if (philosophyPanels.length) {
    const philosophyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            philosophyPanels.forEach((p) => p.classList.remove('is-active'));
            entry.target.classList.add('is-active');
          }
        });
      },
      { threshold: 0.5, rootMargin: '-10% 0px' }
    );

    philosophyPanels.forEach((panel) => philosophyObserver.observe(panel));
    philosophyPanels[0]?.classList.add('is-active');
  }

  /* ============================================
     Experience Atlas — Marker Interactions
     ============================================ */
  let activeMarker = null;

  function showAtlasCard(destinationKey) {
    const data = destinations[destinationKey];
    if (!data || !atlasCard) return;

    document.getElementById('atlasCardImg').src = data.image;
    document.getElementById('atlasCardImg').alt = data.title;
    document.getElementById('atlasCardTitle').textContent = data.title;
    document.getElementById('atlasCardDuration').textContent = data.duration;
    document.getElementById('atlasCardType').textContent = data.type;
    document.getElementById('atlasCardSeason').textContent = data.season;

    atlasCard.hidden = false;
    requestAnimationFrame(() => atlasCard.classList.add('is-visible'));
  }

  function hideAtlasCard() {
    if (!atlasCard) return;
    atlasCard.classList.remove('is-visible');
    setTimeout(() => {
      if (!atlasCard.classList.contains('is-visible')) {
        atlasCard.hidden = true;
      }
    }, 500);
  }

  markers.forEach((marker) => {
    const key = marker.dataset.destination;

    marker.addEventListener('mouseenter', () => {
      markers.forEach((m) => m.classList.remove('is-active'));
      marker.classList.add('is-active');
      activeMarker = marker;
      showAtlasCard(key);
    });

    marker.addEventListener('focus', () => {
      markers.forEach((m) => m.classList.remove('is-active'));
      marker.classList.add('is-active');
      showAtlasCard(key);
    });

    marker.addEventListener('mouseleave', () => {
      marker.classList.remove('is-active');
      activeMarker = null;
      hideAtlasCard();
    });

    marker.addEventListener('blur', () => {
      if (!atlasCard?.matches(':hover')) {
        marker.classList.remove('is-active');
        hideAtlasCard();
      }
    });

    marker.addEventListener('click', () => {
      if (marker.classList.contains('is-active')) {
        hideAtlasCard();
        marker.classList.remove('is-active');
      } else {
        markers.forEach((m) => m.classList.remove('is-active'));
        marker.classList.add('is-active');
        showAtlasCard(key);
      }
    });
  });

  /* ============================================
     Testimonial Letters — Fold Open
     ============================================ */
  letterFolds.forEach((fold) => {
    fold.addEventListener('click', () => {
      const letter = fold.closest('.letter');
      const content = letter.querySelector('.letter__content');
      const isOpen = letter.classList.contains('is-open');

      document.querySelectorAll('.letter.is-open').forEach((openLetter) => {
        if (openLetter !== letter) {
          openLetter.classList.remove('is-open');
          const openFold = openLetter.querySelector('.letter__fold');
          const openContent = openLetter.querySelector('.letter__content');
          openFold.setAttribute('aria-expanded', 'false');
          openContent.hidden = true;
        }
      });

      letter.classList.toggle('is-open', !isOpen);
      fold.setAttribute('aria-expanded', String(!isOpen));
      content.hidden = isOpen;
    });
  });

  /* ============================================
     Scroll Reveal for Sections
     ============================================ */
  const revealElements = document.querySelectorAll(
    '.passport__header, .atlas__intro, .journals__header, .gallery__header, .letters__header, .timeline__header, .gallery__item, .letter'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ============================================
     Invitation Parallax on Scroll
     ============================================ */
  const invitation = document.querySelector('.invitation');
  const parallaxLayers = document.querySelectorAll('.invitation__parallax-layer');

  if (invitation && parallaxLayers.length) {
    window.addEventListener(
      'scroll',
      () => {
        const rect = invitation.getBoundingClientRect();
        const windowH = window.innerHeight;

        if (rect.top < windowH && rect.bottom > 0) {
          const progress = 1 - rect.top / windowH;
          parallaxLayers.forEach((layer, i) => {
            const speed = (i + 1) * 0.03;
            layer.style.transform = `translateY(${progress * 30 * speed}px) scale(${1.1 + progress * 0.02})`;
          });
        }
      },
      { passive: true }
    );
  }

  /* ============================================
     Smooth Anchor Scrolling Offset
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = scrollNav?.classList.contains('is-visible')
        ? scrollNav.offsetHeight
        : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
