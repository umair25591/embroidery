$(document).ready(function () {

    // 1. Navbar Scroll Effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#navbar').addClass('nav-scrolled');
        } else {
            $('#navbar').removeClass('nav-scrolled');
        }
    });

    // 2. 3D TILT EFFECT (The "High Level" Animation)
    // This calculates where the mouse is on the card and tilts it slightly
    $('.tilt-card').on('mousemove', function (e) {
        const card = $(this);
        const cardWidth = card.outerWidth();
        const cardHeight = card.outerHeight();
        const centerX = card.offset().left + cardWidth / 2;
        const centerY = card.offset().top + cardHeight / 2;
        const mouseX = e.pageX - centerX;
        const mouseY = e.pageY - centerY;

        // Rotation intensity
        const rotateX = (mouseY / cardHeight) * -10; // -10 to 10 deg
        const rotateY = (mouseX / cardWidth) * 10;

        card.css('transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    });

    // Reset tilt on mouse leave
    $('.tilt-card').on('mouseleave', function () {
        $(this).css('transform', 'perspective(1000px) rotateX(0) rotateY(0) scale(1)');
    });

    // 3. SCROLL REVEAL (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
    });

    // 4. NUMBER COUNTER ANIMATION
    // Runs only once when stats come into view
    let counted = false;
    const statObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            $('.counter').each(function () {
                var $this = $(this),
                    countTo = $this.attr('data-target');
                $({ countNum: $this.text() }).animate({
                    countNum: countTo
                },
                    {
                        duration: 2000,
                        easing: 'linear',
                        step: function () {
                            $this.text(Math.floor(this.countNum) + "+");
                        },
                        complete: function () {
                            $this.text(this.countNum + "+");
                        }
                    });
            });
            counted = true;
        }
    });
    statObserver.observe(document.querySelector('.stats-container'));

});


$(document).ready(function () {
    const slides = document.querySelectorAll('.slide');
    const sliderContainer = document.querySelector('.hero-visual-side');

    const prevBtn = document.querySelector('.slider-controls .control-btn:nth-child(1)');
    const nextBtn = document.querySelector('.slider-controls .control-btn:nth-child(2)');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    function startTimer() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 4000);
    }

    function stopTimer() {
        clearInterval(slideInterval);
    }

    function resetTimer() {
        stopTimer();
        startTimer();
    }

    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopTimer);
        sliderContainer.addEventListener('mouseleave', startTimer);
    }

    startTimer();
});

$(document).ready(function () {
    const container = document.getElementById('comparisonContainer');
    const afterLayer = document.getElementById('afterLayer');
    const afterImage = afterLayer ? afterLayer.querySelector('img') : null;
    const scroller = document.getElementById('scroller');

    if (container && afterLayer && scroller && afterImage) {

        let isDragging = false;

        // 1. Lock image width (Prevent Squishing)
        const setOverlayWidth = () => {
            const containerWidth = container.getBoundingClientRect().width;
            afterImage.style.width = `${containerWidth}px`;
        };
        setOverlayWidth();
        window.addEventListener('resize', setOverlayWidth);

        // 2. Logic to calculate position
        const moveSlider = (x) => {
            let containerRect = container.getBoundingClientRect();
            let position = x - containerRect.left;

            if (position < 0) position = 0;
            if (position > containerRect.width) position = containerRect.width;

            afterLayer.style.width = position + "px";
            scroller.style.left = position + "px";
        };

        // 3. START DRAGGING (Only on the handle)
        // We use 'mousedown' instead of 'click' to start the drag
        scroller.addEventListener('mousedown', (e) => {
            isDragging = true;
            scroller.classList.add('active'); // Optional: for CSS styling
            e.preventDefault(); // Prevent text selection
        });

        scroller.addEventListener('touchstart', (e) => {
            isDragging = true;
            scroller.classList.add('active');
            e.preventDefault();
        }, { passive: false });

        // 4. DRAG MOVEMENT (Listen on Window)
        // Listening on 'window' ensures smooth dragging even if mouse slips off the handle
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        }, { passive: false });

        // 5. STOP DRAGGING
        const stopDrag = () => {
            isDragging = false;
            scroller.classList.remove('active');
        };

        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
    }
});

$(document).ready(function () {
    // Open Lightbox
    $('.icon-btn').click(function (e) {
        e.stopPropagation();

        const imgSrc = $(this).closest('.gallery-item').find('img').attr('src');

        $('#lightbox-img').attr('src', imgSrc);

        $('#lightbox').fadeIn(300).css('display', 'flex');

        $('body').css('overflow', 'hidden');
    });

    $('.lightbox-close, .lightbox').click(function (e) {
        // Prevent closing if clicking on the image itself
        if (e.target.id !== 'lightbox-img') {

            // fadeOut accepts a "callback" function that runs when animation finishes
            $('#lightbox').fadeOut(300, function () {
                // FIX: Wipe the source URL so the next time it opens, it's clean
                $('#lightbox-img').attr('src', '');
            });

            $('body').css('overflow', 'auto'); // Re-enable scrolling
        }
    });

    // --- 6. FAQ ACCORDION LOGIC ---
    $('.faq-card').click(function () {
        const item = $(this).parent('.faq-item');

        // If clicking the one that is already open, close it
        if (item.hasClass('active')) {
            item.removeClass('active');
            item.find('.faq-body').css('max-height', '0');
        } else {
            // Close all others first (Accordion style)
            $('.faq-item').removeClass('active');
            $('.faq-body').css('max-height', '0');

            // Open the clicked one
            item.addClass('active');
            // We set max-height to the scrollHeight (actual height of content)
            const content = item.find('.faq-body')[0];
            item.find('.faq-body').css('max-height', content.scrollHeight + "px");
        }
    });


    // --- 7. FORM SUBMISSION (Visual Only) ---
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        const btn = $(this).find('button');
        const originalText = btn.html();
        
        // Change button to loading state
        btn.html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...');
        
        // Simulate delay
        setTimeout(function() {
            btn.html('<i class="fa-solid fa-check"></i> Sent Successfully!');
            btn.css('background', 'var(--accent-success)');
            
            // Reset form
            $('#contactForm')[0].reset();
            
            // Revert button after 3 seconds
            setTimeout(() => {
                btn.html(originalText);
                btn.css('background', ''); // Reset to gradient
            }, 3000);
        }, 1500);
    });
})