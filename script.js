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

document.addEventListener("DOMContentLoaded", () => {
    fetchVehicles();
});

async function fetchVehicles() {
    try {
        const response = await fetch('./vehicles.json');
        const vehicles = await response.json();
        
        
        const newArrivals = vehicles.slice(0, 6);
        renderVehicles(newArrivals);
    } catch (error) {
        console.error("Error loading vehicles:", error);
    }
}

function renderVehicles(vehicleList) {
    const grid = document.getElementById('new-arrivals-grid');
    grid.innerHTML = '';

    vehicleList.forEach(car => {
        const card = document.createElement('div');
        card.className = "group relative bg-carbon rounded-xl overflow-hidden border border-carbon hover:border-infrared/50 transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] shadow-lg";
        
        card.innerHTML = `
            <!-- Background Image -->
            <img src="${car.mainImage}" alt="${car.brand} ${car.model}" 
                 class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 z-0" />
            
            <!-- Dark Gradient Overlay -->
            <div class="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/70 to-transparent z-10"></div>

            <!-- Content Area -->
            <div class="relative z-20 p-6">
                <span class="text-[11px] font-bold uppercase tracking-widest text-slate block mb-1">
                    ${car.brand}
                </span>
                <h3 class="text-xl font-bold text-white mb-4 group-hover:text-infrared transition">
                    ${car.model}
                </h3>

                <!-- Specs Row -->
                <div class="flex items-center space-x-4 text-xs text-silver/80 pt-3 border-t border-white/10">
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect width="18" height="18" x="3" y="4" rx="2" stroke-width="2"/>
                            <line x1="16" x2="16" y1="2" y2="6" stroke-width="2"/>
                            <line x1="8" x2="8" y1="2" y2="6" stroke-width="2"/>
                            <line x1="3" x2="21" y1="10" y2="10" stroke-width="2"/>
                        </svg>
                        ${car.year}
                    </span>
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" stroke-width="2"/>
                            <path d="M12 7v5l3 3" stroke-width="2"/>
                        </svg>
                        ${car.power}
                    </span>
                    <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M3 22h12M4 9h10M4 5h10a2 2 0 0 1 2 2v15H2V7a2 2 0 0 1 2-2z" stroke-width="2"/>
                        </svg>
                        ${car.fuel}
                    </span>
                </div>
            </div>
        `;

        
        card.addEventListener('click', () => {
            openVehicleModal(car.id);
        });

        grid.appendChild(card);
    });
}

function openVehicleModal(vehicleId) {
    console.log("Clicked vehicle ID:", vehicleId);
    
}


let allVehicles = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchVehicles();
    setupModalEvents();
});

async function fetchVehicles() {
    try {
        const response = await fetch('./vehicles.json');
        allVehicles = await response.json();
        renderVehicles(allVehicles.slice(0, 6));
    } catch (error) {
        console.error("Error loading vehicles:", error);
    }
}

function renderVehicles(vehicleList) {
    const grid = document.getElementById('new-arrivals-grid');
    grid.innerHTML = '';

    vehicleList.forEach(car => {
        const card = document.createElement('div');
        card.className = "group relative bg-carbon rounded-xl overflow-hidden border border-carbon hover:border-infrared/50 transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] shadow-lg";
        
        card.innerHTML = `
            <img src="${car.mainImage}" alt="${car.brand} ${car.model}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 z-0" />
            <div class="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/70 to-transparent z-10"></div>
            <div class="relative z-20 p-6">
                <span class="text-[11px] font-bold uppercase tracking-widest text-slate block mb-1">${car.brand}</span>
                <h3 class="text-xl font-bold text-white mb-4 group-hover:text-infrared transition">${car.model}</h3>
                <div class="flex items-center space-x-4 text-xs text-silver/80 pt-3 border-t border-white/10">
                    <span>${car.year}</span>
                    <span>${car.power}</span>
                    <span>${car.fuel}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openVehicleModal(car.id));
        grid.appendChild(card);
    });
}

function openVehicleModal(vehicleId) {
    const car = allVehicles.find(v => v.id === vehicleId);
    if (!car) return;

   
    document.getElementById('modal-main-img').src = car.mainImage;
    document.getElementById('modal-brand').textContent = car.brand;
    document.getElementById('modal-model').textContent = car.model;
    document.getElementById('modal-desc').textContent = car.description;
    document.getElementById('modal-accel').textContent = car.acceleration;
    document.getElementById('modal-top-speed').textContent = car.topSpeed;
    document.getElementById('modal-power').textContent = car.power;
    document.getElementById('modal-engine').textContent = car.engine;
    document.getElementById('modal-year').textContent = car.year;
    document.getElementById('modal-mileage').textContent = car.mileage;
    document.getElementById('modal-fuel').textContent = car.fuel;
    document.getElementById('modal-color').textContent = car.color;

    
    const thumbsContainer = document.getElementById('modal-thumbnails');
    thumbsContainer.innerHTML = '';
    const imagesList = [car.mainImage, ...(car.thumbnails || [])];

    imagesList.forEach(imgUrl => {
        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        thumb.className = "w-16 h-12 object-cover rounded-lg border border-carbon hover:border-infrared cursor-pointer transition";
        thumb.addEventListener('click', () => {
            document.getElementById('modal-main-img').src = imgUrl;
        });
        thumbsContainer.appendChild(thumb);
    });

   
    document.getElementById('vehicle-modal').classList.remove('hidden');
}

function setupModalEvents() {
    const modal = document.getElementById('vehicle-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}