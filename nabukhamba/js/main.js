/* ====================================================
   NABUKHAMBA GUEST HOUSE - Main JavaScript
   ==================================================== */

// ---- NAVBAR SCROLL BEHAVIOR ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- MOBILE NAV TOGGLE ----
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Close mobile nav button
const closeNav = document.getElementById('closeNav');
if (closeNav) {
  closeNav.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// ---- SCROLL REVEAL (Intersection Observer) ----
const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}

// ---- PACKAGES TAB SWITCHING (packages.html) ----
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length > 0) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        content.style.display = content.id === target ? 'grid' : 'none';
      });
    });
  });
}

// ---- BOOKING FORM (book.html) ----
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.querySelector('[type="submit"]');
    const formMsg = document.getElementById('formMsg');
    const originalText = submitBtn.innerHTML;

    // Collect form data
    const name     = bookingForm.querySelector('[name="name"]').value.trim();
    const phone    = bookingForm.querySelector('[name="phone"]').value.trim();
    const email    = bookingForm.querySelector('[name="email"]').value.trim();
    const package_ = bookingForm.querySelector('[name="package"]').value;
    const date     = bookingForm.querySelector('[name="date"]').value;
    const guests   = bookingForm.querySelector('[name="guests"]').value;
    const message  = bookingForm.querySelector('[name="message"]').value.trim();

    // Loading state
    submitBtn.innerHTML = '<span>Sending…</span>';
    submitBtn.disabled = true;

    try {
      // Send to Formspree
      const res = await fetch('https://formspree.io/f/mwvabyop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, phone, email, package: package_, date, guests, message })
      });

      if (res.ok) {
        // Show success
        if (formMsg) {
          formMsg.className = 'form-msg success';
          formMsg.textContent = '✅ Booking request sent! We will confirm via WhatsApp or email shortly.';
        }
        bookingForm.reset();

        // Also open WhatsApp with pre-filled message
        const waMsg = encodeURIComponent(
          `Hello Nabukhamba Guest House! 🙏\n\nI'd like to book:\n👤 Name: ${name}\n📱 Phone: ${phone}\n📦 Package: ${package_}\n📅 Date: ${date}\n👥 Guests: ${guests}\n💬 Message: ${message || 'N/A'}\n\nPlease confirm availability. Thank you!`
        );
        setTimeout(() => {
          window.open(`https://wa.me/254745365756?text=${waMsg}`, '_blank');
        }, 800);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      if (formMsg) {
        formMsg.className = 'form-msg error';
        formMsg.textContent = '❌ Something went wrong. Please try WhatsApp directly or call us.';
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ---- ACTIVE NAV LINK (for inner pages) ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- GALLERY LIGHTBOX (simple) ----
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  // Create lightbox
  const lb = document.createElement('div');
  lb.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;
    display:none;align-items:center;justify-content:center;cursor:pointer;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;object-fit:contain;';
  lb.appendChild(lbImg);
  document.body.appendChild(lb);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lbImg.src = img.src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lb.addEventListener('click', () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  });
}

// ---- PRELOAD: set current year in footer ----
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
