// script.js
document.addEventListener('DOMContentLoaded', function() {
    // State management
    let currentUser = null;
    let currentView = 'default';
    let listings = [];
    let map = null;
    let markers = [];

    // Initialize sample data
    initializeSampleData();

    // Modal elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const createListingModal = document.getElementById('createListingModal');

    // View elements
    const defaultView = document.getElementById('defaultView');
    const businessDashboard = document.getElementById('businessDashboard');
    const listView = document.getElementById('listView');
    const mapView = document.getElementById('mapView');
    const listViewBtn = document.getElementById('listViewBtn');
    const mapViewBtn = document.getElementById('mapViewBtn');

    // Initialize event listeners
    initializeEventListeners();

    function initializeSampleData() {
        listings = [
            {
                id: 1,
                businessName: "Green Cafe",
                foodItem: "Fresh Sandwiches",
                category: "prepared-meals",
                quantity: "15 portions",
                description: "Assorted fresh sandwiches from today's lunch service",
                pickupTime: "2024-01-15T18:00",
                address: "123 Main St, Cityville",
                coordinates: [40.7128, -74.0060],
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                claimed: false
            },
            {
                id: 2,
                businessName: "Bakery Delight",
                foodItem: "Assorted Pastries",
                category: "baked-goods",
                quantity: "25 pieces",
                description: "Day-old pastries including croissants and muffins",
                pickupTime: "2024-01-15T19:00",
                address: "456 Oak Ave, Townsville",
                coordinates: [40.7282, -73.9942],
                image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=400",
                claimed: false
            },
            {
                id: 3,
                businessName: "Fresh Market",
                foodItem: "Organic Vegetables",
                category: "fresh-produce",
                quantity: "10kg",
                description: "Mixed organic vegetables from today's delivery",
                pickupTime: "2024-01-16T17:00",
                address: "789 Pine Rd, Villagetown",
                coordinates: [40.7505, -73.9934],
                image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
                claimed: false
            }
        ];
    }

    function initializeEventListeners() {
        // Auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => showModal(loginModal));
        document.getElementById('registerBtn').addEventListener('click', () => showModal(registerModal));
        document.getElementById('cancelLogin').addEventListener('click', () => hideModal(loginModal));
        document.getElementById('cancelRegister').addEventListener('click', () => hideModal(registerModal));

        // User type selection
        document.getElementById('businessBtn').addEventListener('click', () => handleUserTypeSelection('business'));
        document.getElementById('recipientBtn').addEventListener('click', () => handleUserTypeSelection('recipient'));

        // View toggles
        listViewBtn.addEventListener('click', () => toggleView('list'));
        mapViewBtn.addEventListener('click', () => toggleView('map'));

        // Forms
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
        document.getElementById('createListingForm').addEventListener('submit', handleCreateListing);
        document.getElementById('cancelCreateListing').addEventListener('click', () => hideModal(createListingModal));

        // Business dashboard
        document.getElementById('createListingBtn').addEventListener('click', () => showModal(createListingModal));

        // Filters
        document.getElementById('applyFilters').addEventListener('click', applyFilters);
    }

    function showModal(modal) {
        modal.classList.remove('hidden');
    }

    function hideModal(modal) {
        modal.classList.add('hidden');
    }

    function handleUserTypeSelection(type) {
        if (type === 'business') {
            showModal(registerModal);
        } else {
            // For recipients, show the default view with listings
            renderListings();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        // Simulate login
        currentUser = {
            type: 'business',
            name: 'Test Business',
            email: 'test@business.com'
        };
        
        hideModal(loginModal);
        showBusinessDashboard();
        showNotification('Successfully logged in!', 'success');
    }

    function handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userType = e.target.querySelector('select').value;
        
        currentUser = {
            type: userType,
            name: formData.get('name') || 'New User',
            email: formData.get('email') || 'user@example.com'
        };

        hideModal(registerModal);
        
        if (userType === 'business') {
            showBusinessDashboard();
        } else {
            showDefaultView();
        }
        
        showNotification('Account created successfully!', 'success');
    }

    function handleCreateListing(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newListing = {
            id: listings.length + 1,
            businessName: currentUser?.name || 'Local Business',
            foodItem: formData.get('foodItem') || 'Food Item',
            category: formData.get('category') || 'prepared-meals',
            quantity: formData.get('quantity') || '1 portion',
            description: formData.get('description') || 'Fresh food available for pickup',
            pickupTime: formData.get('pickupTime') || new Date().toISOString(),
            address: '123 Business Location',
            coordinates: [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1],
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
            claimed: false
        };

        listings.unshift(newListing);
        hideModal(createListingModal);
        renderBusinessListings();
        showNotification('Food listing created successfully!', 'success');
    }

    function showBusinessDashboard() {
        defaultView.classList.add('hidden');
        businessDashboard.classList.remove('hidden');
        currentView = 'business';
        renderBusinessListings();
    }

    function showDefaultView() {
        businessDashboard.classList.add('hidden');
        defaultView.classList.remove('hidden');
        currentView = 'default';
        renderListings();
    }

    function toggleView(viewType) {
        if (viewType === 'map') {
            listView.classList.add('hidden');
            mapView.classList.remove('hidden');
            listViewBtn.classList.remove('bg-green-600', 'text-white');
            listViewBtn.classList.add('bg-gray-200', 'text-gray-700');
            mapViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
            mapViewBtn.classList.add('bg-green-600', 'text-white');
            initializeMap();
        } else {
            mapView.classList.add('hidden');
            listView.classList.remove('hidden');
            mapViewBtn.classList.remove('bg-green-600', 'text-white');
            mapViewBtn.classList.add('bg-gray-200', 'text-gray-700');
            listViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
            listViewBtn.classList.add('bg-green-600', 'text-white');
        }
    }

    function renderListings() {
        const filteredListings = getFilteredListings();
        listView.innerHTML = '';

        filteredListings.forEach(listing => {
            const listingElement = createListingCard(listing);
            listView.appendChild(listingElement);
        });
    }

    function renderBusinessListings() {
        const businessListingsContainer = document.getElementById('businessListings');
        businessListingsContainer.innerHTML = '';

        const userListings = listings.filter(listing => 
            listing.businessName === (currentUser?.name || 'Local Business')
        );

        userListings.forEach(listing => {
            const listingElement = createBusinessListingRow(listing);
            businessListingsContainer.appendChild(listingElement);
        });
    }

    function createListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200';
        
        card.innerHTML = `
            <img src="${listing.image}" alt="${listing.foodItem}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">${listing.foodItem}</h3>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${getCategoryLabel(listing.category)}</span>
                </div>
                <p class="text-gray-600 mb-2">${listing.businessName}</p>
                <p class="text-gray-700 mb-4">${listing.description}</p>
                <div class="flex justify-between items-center mb-4">
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-weight mr-1"></i> ${listing.quantity}
                    </div>
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-clock mr-1"></i> ${formatDate(listing.pickupTime)}
                    </div>
                </div>
                <div class="text-sm text-gray-600 mb-4">
                    <i class="fas fa-map-marker-alt mr-1"></i> ${listing.address}
                </div>
                <button onclick="claimFood(${listing.id})" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200 ${listing.claimed ? 'bg-gray-400 cursor-not-allowed' : ''}" ${listing.claimed ? 'disabled' : ''}>
                    ${listing.claimed ? 'Claimed' : 'Claim Food'}
                </button>
            </div>
        `;
        
        return card;
    }

    function createBusinessListingRow(listing) {
        const row = document.createElement('div');
        row.className = 'px-6 py-4 flex justify-between items-center';
        
        row.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${listing.image}" alt="${listing.foodItem}" class="w-16 h-16 object-cover rounded">
                <div>
                    <h4 class="font-semibold text-gray-900">${listing.foodItem}</h4>
                    <p class="text-sm text-gray-600">${listing.quantity} • ${formatDate(listing.pickupTime)}</p>
                    <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">${getCategoryLabel(listing.category)}</span>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-sm ${listing.claimed ? 'text-green-600' : 'text-orange-600'}">
                    ${listing.claimed ? 'Claimed' : 'Available'}
                </span>
                <button onclick="editListing(${listing.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteListing(${listing.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return row;
    }

    function initializeMap() {
        if (map) {
            map.remove();
            markers.forEach(marker => marker.remove());
            markers = [];
        }

        map = L.map('map').setView([40.7128, -74.0060], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const filteredListings = getFilteredListings();
        
        filteredListings.forEach(listing => {
            const marker = L.marker(listing.coordinates)
                .addTo(map)
                .bindPopup(`
                    <div class="p-2">
                        <h3 class="font-semibold">${listing.foodItem}</h3>
                        <p class="text-sm">${listing.businessName}</p>
                        <p class="text-sm">${listing.quantity}</p>
                        <button onclick="claimFood(${listing.id})" class="mt-2 w-full bg-green-600 text-white text-sm py-1 rounded hover:bg-green-700 ${listing.claimed ? 'bg-gray-400 cursor-not-allowed' : ''}" ${listing.claimed ? 'disabled' : ''}>
                            ${listing.claimed ? 'Claimed' : 'Claim Food'}
                        </button>
                    </div>
                `);
            markers.push(marker);
        });
    }

    function applyFilters() {
        renderListings();
        if (!mapView.classList.contains('hidden')) {
            initializeMap();
        }
    }

    function getFilteredListings() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const distanceFilter = document.getElementById('distanceFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;

        return listings.filter(listing => {
            const categoryMatch = !categoryFilter || listing.category === categoryFilter;
            const timeMatch = !timeFilter || filterByTime(listing.pickupTime, timeFilter);
            
            return categoryMatch && timeMatch;
        });
    }

    function filterByTime(pickupTime, filter) {
        const now = new Date();
        const pickupDate = new Date(pickupTime);

        switch (filter) {
            case 'today':
                return pickupDate.toDateString() === now.toDateString();
            case 'tomorrow':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return pickupDate.toDateString() === tomorrow.toDateString();
            case 'week':
                const nextWeek = new Date(now);
                nextWeek.setDate(nextWeek.getDate() + 7);
                return pickupDate <= nextWeek;
            default:
                return true;
        }
    }

    function getCategoryLabel(category) {
        const labels = {
            'baked-goods': 'Baked Goods',
            'prepared-meals': 'Prepared Meals',
            'fresh-produce': 'Fresh Produce',
            'dairy': 'Dairy'
        };
        return labels[category] || category;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Global functions for button clicks
    window.claimFood = function(listingId) {
        const listing = listings.find(l => l.id === listingId);
        if (listing && !listing.claimed) {
            listing.claimed = true;
            renderListings();
            if (!mapView.classList.contains('hidden')) {
                initializeMap();
            }
            showNotification('Sccessfully claimed ${listing.foodItem}', 'success');
        }
    };

    window.editListing = function(listingId) {
        showNotification('Edit functionality coming soon!', 'success');
    };

    window.deleteListing = function(listingId) {
        if (confirm('Are you sure you want to delete this listing?')) {
            listings = listings.filter(l => l.id !== listingId);
            renderBusinessListings();
            showNotification('Listing deleted successfully!', 'success');
        }
    };

    // Initial render
    renderListings();
});