
let allVehicles = [];
let filteredVehicles = [];
const cardsPerPage = 9;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupHeroCarousel();
    loadVehicleData();
    setupModalListeners();
});


function setupMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    const iconOpen = document.getElementById("menu-icon-open");
    const iconClose = document.getElementById("menu-icon-close");

    if (btn && menu) {
        btn.addEventListener("click", () => {
            const isHidden = menu.classList.toggle("hidden");
            if (iconOpen && iconClose) {
                if (isHidden) {
                    iconOpen.classList.remove("hidden");
                    iconClose.classList.add("hidden");
                } else {
                    iconOpen.classList.add("hidden");
                    iconClose.classList.remove("hidden");
                }
            }
        });

        const menuLinks = menu.querySelectorAll("a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.add("hidden");
                if (iconOpen && iconClose) {
                    iconOpen.classList.remove("hidden");
                    iconClose.classList.add("hidden");
                }
            });
        });
    }
}


function setupHeroCarousel() {
    const slides = document.querySelectorAll('#hero-carousel img');
    if (slides.length === 0) return; 

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('opacity-100');
        slides[currentSlide].classList.add('opacity-0');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.remove('opacity-0');
        slides[currentSlide].classList.add('opacity-100');
    }, 5000);
}


async function loadVehicleData() {
    try {
        const response = await fetch('./vehicles.json');
        allVehicles = await response.json();

        const newArrivalsGrid = document.getElementById('new-arrivals-grid');
        const allVehiclesGrid = document.getElementById('all-vehicles-grid');

        if (newArrivalsGrid) {
           
            const newArrivals = allVehicles.slice(0, 6);
            renderCards(newArrivals, newArrivalsGrid);
        } else if (allVehiclesGrid) {
            
            filteredVehicles = allVehicles;
            populateDropdowns();
            setupFilterListeners();
            applyFilters(1);
        }
    } catch (error) {
        console.error("Error loading vehicles JSON:", error);
    }
}


function populateDropdowns() {
    const makeSelect = document.getElementById('make-select');
    const bodySelect = document.getElementById('body-select');
    if (!makeSelect || !bodySelect) return;

    const makes = [...new Set(allVehicles.map(v => v.brand))].sort();
    const categories = [...new Set(allVehicles.map(v => v.category))].sort();

    makes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
    });

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        bodySelect.appendChild(option);
    });
}


function applyFilters(page = 1) {
    const searchInput = document.getElementById('search-input');
    const makeSelect = document.getElementById('make-select');
    const bodySelect = document.getElementById('body-select');

    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedMake = makeSelect.value;
    const selectedBody = bodySelect.value;

    filteredVehicles = allVehicles.filter(vehicle => {
        const matchesSearch = searchTerm === '' ||
            vehicle.model.toLowerCase().includes(searchTerm) ||
            vehicle.brand.toLowerCase().includes(searchTerm);

        const matchesMake = selectedMake === 'All Brands' || vehicle.brand === selectedMake;
        const matchesBody = selectedBody === 'All Types' || vehicle.category === selectedBody;

        return matchesSearch && matchesMake && matchesBody;
    });

    currentPage = page;
    

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const vehiclesToShow = filteredVehicles.slice(start, end);

    const grid = document.getElementById('all-vehicles-grid');
    renderCards(vehiclesToShow, grid);
    renderPagination();
}

function setupFilterListeners() {
    const searchInput = document.getElementById('search-input');
    const makeSelect = document.getElementById('make-select');
    const bodySelect = document.getElementById('body-select');
    const resetBtn = document.getElementById('reset-filters');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => applyFilters(1));
    makeSelect.addEventListener('change', () => applyFilters(1));
    bodySelect.addEventListener('change', () => applyFilters(1));

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        makeSelect.value = 'All Brands';
        bodySelect.value = 'All Types';
        applyFilters(1);
    });
}


function renderCards(vehicleList, targetGrid) {
    if (!targetGrid) return;
    targetGrid.innerHTML = '';

    
    const countEl = document.getElementById('vehicle-count');
    if (countEl) {
        countEl.textContent = `${filteredVehicles.length} units available`;
    }

    if (vehicleList.length === 0) {
        targetGrid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 border border-carbon rounded-2xl bg-carbon/20">
            <svg class="w-12 h-12 text-slate mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-lg text-slate">No vehicles match your criteria.</p>
        </div>`;
        return;
    }

    vehicleList.forEach(car => {
        const card = document.createElement('div');
        card.className = "group relative bg-carbon rounded-xl overflow-hidden border border-carbon hover:border-infrared/50 transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] shadow-lg";

        card.innerHTML = `
            <img src="${car.mainImage}" alt="${car.brand} ${car.model}" 
                 class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 z-0" />
            
            <div class="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/60 to-transparent z-10"></div>

            <div class="relative z-20 p-6 w-full">
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate block mb-1">
                    ${car.brand}
                </span>
                <h3 class="text-xl font-bold text-white mb-4 group-hover:text-infrared transition">
                    ${car.model}
                </h3>

                <div class="flex items-center justify-between text-xs text-silver/80 pt-3 border-t border-white/10">
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" stroke-width="2"/><line x1="16" x2="16" y1="2" y2="6" stroke-width="2"/><line x1="8" x2="8" y1="2" y2="6" stroke-width="2"/><line x1="3" x2="21" y1="10" y2="10" stroke-width="2"/></svg>
                        ${car.year}
                    </span>
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        ${car.power}
                    </span>
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 22h12M4 9h10M4 5h10a2 2 0 0 1 2 2v15H2V7a2 2 0 0 1 2-2z" stroke-width="2"/></svg>
                        ${car.fuel}
                    </span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => showModal(car.id));
        targetGrid.appendChild(card);
    });
}


function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    container.innerHTML = '';
    const totalPages = Math.ceil(filteredVehicles.length / cardsPerPage);

    if (totalPages <= 1) return;

    
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-5 py-2.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition ${currentPage === 1 ? 'border-carbon/50 text-slate cursor-not-allowed' : 'border-carbon text-silver hover:bg-carbon hover:text-white'}`;
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => { if (currentPage > 1) applyFilters(currentPage - 1); });
    container.appendChild(prevBtn);

   
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `w-10 h-10 rounded-lg border text-xs font-bold transition flex items-center justify-center ${currentPage === i ? 'border-infrared bg-infrared text-white shadow-lg shadow-infrared/20' : 'border-carbon text-silver hover:bg-carbon hover:text-white'}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => applyFilters(i));
        container.appendChild(pageBtn);
    }

    
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-5 py-2.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition ${currentPage === totalPages ? 'border-carbon/50 text-slate cursor-not-allowed' : 'border-carbon text-silver hover:bg-carbon hover:text-white'}`;
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => { if (currentPage < totalPages) applyFilters(currentPage + 1); });
    container.appendChild(nextBtn);
}


function showModal(id) {
    const vehicle = allVehicles.find(v => v.id === id);
    if (!vehicle) return;

    document.getElementById('modal-main-img').src = vehicle.mainImage;
    document.getElementById('modal-brand').textContent = vehicle.brand;
    document.getElementById('modal-model').textContent = vehicle.model;
    document.getElementById('modal-desc').textContent = vehicle.description;
    document.getElementById('modal-accel').textContent = vehicle.acceleration;
    document.getElementById('modal-top-speed').textContent = vehicle.topSpeed;
    document.getElementById('modal-power').textContent = vehicle.power;
    document.getElementById('modal-engine').textContent = vehicle.engine;
    document.getElementById('modal-year').textContent = vehicle.year;
    document.getElementById('modal-mileage').textContent = vehicle.mileage;
    document.getElementById('modal-fuel').textContent = vehicle.fuel;
    document.getElementById('modal-color').textContent = vehicle.color;

    const thumbsContainer = document.getElementById('modal-thumbnails');
    thumbsContainer.innerHTML = '';

    const imagesList = [vehicle.mainImage, ...(vehicle.thumbnails || [])];

    imagesList.forEach(imgUrl => {
        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        thumb.className = "w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-infrared cursor-pointer transition flex-shrink-0";

        thumb.addEventListener('click', () => {
            const mainImg = document.getElementById('modal-main-img');
            mainImg.style.opacity = '0.7';
            setTimeout(() => {
                mainImg.src = imgUrl;
                mainImg.style.opacity = '1';
            }, 150);
        });
        thumbsContainer.appendChild(thumb);
    });

    document.body.style.overflow = 'hidden';
    document.getElementById('vehicle-modal').classList.remove('hidden');
}

function setupModalListeners() {
    const modal = document.getElementById('vehicle-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    if (!modal || !closeBtn) return;

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; 
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}