document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('#hero-carousel img');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            
            slides[currentSlide].classList.remove('opacity-100');
            slides[currentSlide].classList.add('opacity-0');

            
            currentSlide = (currentSlide + 1) % slides.length;

            
            slides[currentSlide].classList.remove('opacity-0');
            slides[currentSlide].classList.add('opacity-100');
        }, 5000); 
    }
});
