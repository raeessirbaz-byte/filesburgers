/* =========================================================
   FILE'S BURGERS — main.js
   Handles: mobile nav, hero slider, scroll animations,
            menu scroll-spy, sticky category nav
   ========================================================= */

(function () {
  'use strict';

  /* ── Mobile Nav ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,.55)'
        : '0 2px 10px rgba(0,0,0,.4)';
    }, { passive: true });
  }

  /* ── Hero Slider ── */
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.hero-dot');
  let current   = 0;
  let autoPlay;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }

  if (slides.length > 1) {
    autoPlay = setInterval(nextSlide, 5000);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(autoPlay);
        goToSlide(parseInt(dot.dataset.slide, 10));
        autoPlay = setInterval(nextSlide, 5000);
      });
    });
  }

  /* ── Scroll-triggered Fade-Up Animations ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Featured Card Slider (prev/next arrows) ── */
  const featTrack = document.getElementById('featTrack');
  const featPrev  = document.getElementById('featPrev');
  const featNext  = document.getElementById('featNext');

  if (featTrack && featPrev && featNext) {
    const cardWidth = () => {
      const card = featTrack.querySelector('.feat-card');
      return card ? card.offsetWidth + 18 : 268;
    };
    featNext.addEventListener('click', () => {
      featTrack.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
    });
    featPrev.addEventListener('click', () => {
      featTrack.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' });
    });
  }

  /* ── Menu Page: Sticky Category Nav + Scroll Spy ── */
  const menuCatBtns = document.querySelectorAll('.menu-cat-btn');
  const menuSections = document.querySelectorAll('.menu-section');

  if (menuCatBtns.length && menuSections.length) {

    // Click → smooth scroll to section
    menuCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const section  = document.getElementById(targetId);
        if (section) {
          const offset = section.getBoundingClientRect().top + window.scrollY - 140;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });

    // Scroll spy — highlight active category
    function updateActiveCat() {
      let current = menuSections[0].id;
      menuSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 160) current = section.id;
      });
      menuCatBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === current);
      });
    }

    window.addEventListener('scroll', updateActiveCat, { passive: true });
    updateActiveCat();
  }

  /* ── Homepage: Category strip active state ── */
  const catItems = document.querySelectorAll('.cat-item');
  catItems.forEach(item => {
    item.addEventListener('click', () => {
      catItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Marquee pause on hover ── */
  const track = document.querySelector('.hashtag-track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

})();
