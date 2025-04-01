document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggling
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  if (menuToggle && navMenu && menuOverlay) {
    // Add ARIA attributes to menu toggle
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'main-navigation');
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Add ID to navigation for ARIA controls
    if (navMenu.id !== 'main-navigation') {
      navMenu.id = 'main-navigation';
    }
    
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
      menuOverlay.classList.toggle('open');
      document.body.classList.toggle('menu-open');
      
      // Trap focus within menu when open
      if (!isExpanded) {
        // Focus first link after opening
        setTimeout(() => {
          navMenu.querySelector('a').focus();
        }, 100);
      }
    });
    
    menuOverlay.addEventListener('click', function() {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuToggle.focus(); // Return focus to menu toggle
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuToggle.focus(); // Return focus to menu toggle
      }
    });
  }
  
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuOverlay.classList.remove('open');
          document.body.classList.remove('menu-open');
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        navLink.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);
  
  // Form validation
  const contactForm = document.querySelector('#contactForm');
  
  if (contactForm) {
    const formErrorContainer = document.createElement('div');
    formErrorContainer.classList.add('form-error-summary');
    formErrorContainer.setAttribute('aria-live', 'assertive');
    formErrorContainer.setAttribute('role', 'alert');
    formErrorContainer.style.display = 'none';
    contactForm.prepend(formErrorContainer);
    
    contactForm.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      const errorMessages = [];
      
      requiredFields.forEach(field => {
        // Remove previous errors
        field.classList.remove('error');
        const errorId = `${field.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
          errorElement.textContent = '';
        }
        
        // Check for empty fields
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          field.setAttribute('aria-invalid', 'true');
          
          // Add error message
          const fieldLabel = contactForm.querySelector(`label[for="${field.id}"]`).textContent.trim();
          const errorMsg = `${fieldLabel} is required`;
          errorMessages.push(errorMsg);
          
          // Add inline error if error element exists
          if (errorElement) {
            errorElement.textContent = 'This field is required';
          }
        } 
        // Email validation
        else if (field.type === 'email' && field.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            // Add error message
            const fieldLabel = contactForm.querySelector(`label[for="${field.id}"]`).textContent.trim();
            const errorMsg = `${fieldLabel} must be a valid email address`;
            errorMessages.push(errorMsg);
            
            // Add inline error if error element exists
            if (errorElement) {
              errorElement.textContent = 'Please enter a valid email address';
            }
          } else {
            field.setAttribute('aria-invalid', 'false');
          }
        } else {
          field.setAttribute('aria-invalid', 'false');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        
        // Display error summary
        if (errorMessages.length > 0) {
          formErrorContainer.innerHTML = `
            <h3>Please correct the following errors:</h3>
            <ul>
              ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
            </ul>
          `;
          formErrorContainer.style.display = 'block';
          
          // Focus the first invalid field
          contactForm.querySelector('.error').focus();
        }
      } else {
        formErrorContainer.style.display = 'none';
      }
    });
    
    // Clear error state on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', function() {
        this.classList.remove('error');
        this.setAttribute('aria-invalid', 'false');
        
        const errorId = `${field.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
          errorElement.textContent = '';
        }
      });
    });
  }
  
  // Testimonial slider (if present)
  const testimonialSlider = document.querySelector('.testimonial-slider');
  
  if (testimonialSlider) {
    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;
    const prevBtn = testimonialSlider.querySelector('.slider-prev');
    const nextBtn = testimonialSlider.querySelector('.slider-next');
    
    // Add ARIA attributes to slider buttons
    if (prevBtn) {
      prevBtn.setAttribute('aria-label', 'Previous testimonial');
    }
    if (nextBtn) {
      nextBtn.setAttribute('aria-label', 'Next testimonial');
    }
    
    // Add ARIA attributes to slides
    slides.forEach((slide, index) => {
      slide.setAttribute('role', 'tabpanel');
      slide.setAttribute('id', `testimonial-${index + 1}`);
      slide.setAttribute('aria-hidden', 'true');
    });
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.style.display = isActive ? 'block' : 'none';
        slide.setAttribute('aria-hidden', !isActive);
      });
      
      // Announce slide change for screen readers
      const liveRegion = testimonialSlider.querySelector('.slider-live-region');
      if (liveRegion) {
        liveRegion.textContent = `Showing testimonial ${index + 1} of ${totalSlides}`;
      }
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }
    
    // Create live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.className = 'slider-live-region sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    testimonialSlider.appendChild(liveRegion);
    
    // Initialize slider
    if (slides.length > 0) {
      showSlide(currentSlide);
      
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);
      
      // Keyboard navigation
      testimonialSlider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      });
      
      // Auto-rotation (pause on hover/focus)
      let autoRotation = setInterval(nextSlide, 8000);
      
      testimonialSlider.addEventListener('mouseenter', function() {
        clearInterval(autoRotation);
      });
      
      testimonialSlider.addEventListener('mouseleave', function() {
        autoRotation = setInterval(nextSlide, 8000);
      });
      
      testimonialSlider.addEventListener('focusin', function() {
        clearInterval(autoRotation);
      });
      
      testimonialSlider.addEventListener('focusout', function(e) {
        if (!testimonialSlider.contains(e.relatedTarget)) {
          autoRotation = setInterval(nextSlide, 8000);
        }
      });
    }
  }
  
  // Accordion functionality (if present)
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    if (header) {
      header.addEventListener('click', function() {
        item.classList.toggle('open');
        
        const content = item.querySelector('.accordion-content');
        
        if (content) {
          if (item.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0';
          }
        }
      });
    }
  });
  
  // Animation on scroll
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  function checkFadeElements() {
    const triggerBottom = window.innerHeight * 0.8;
    
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('fade-in');
      }
    });
  }
  
  window.addEventListener('scroll', checkFadeElements);
  checkFadeElements(); // Check on initial load
});