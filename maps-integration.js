// Integracja z Google Maps API dla kalkulatora cen kursu Xpress Delivery
// Zaktualizowana wersja korzystająca z pliku konfiguracyjnego

// Globalne zmienne dla Google Maps
let map;
let directionsService;
let directionsRenderer;
let autocompletePickup;
let autocompleteDelivery;
let geocoder;

// Inicjalizacja Google Maps API
function initGoogleMaps() {
    // Inicjalizacja usług Google Maps
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#FFD100',
            strokeWeight: 5
        }
    });
    
    // Inicjalizacja mapy
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 52.2297, lng: 21.0122 }, // Warszawa
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
    });
    
    // Przypisanie renderera kierunków do mapy
    directionsRenderer.setMap(map);
    
    // Inicjalizacja autouzupełniania dla pól adresowych
    initAutocomplete();
}

// Inicjalizacja autouzupełniania adresów
function initAutocomplete() {
    // Ograniczenie wyników do kraju z konfiguracji
    const options = {
        componentRestrictions: { country: config.geographicRestrictions.country }
    };
    
    // Autouzupełnianie dla adresu odbioru
    autocompletePickup = new google.maps.places.Autocomplete(
        document.getElementById('pickup-address'),
        options
    );
    
    // Autouzupełnianie dla adresu dostawy
    autocompleteDelivery = new google.maps.places.Autocomplete(
        document.getElementById('delivery-address'),
        options
    );
    
    // Zapobieganie wysłaniu formularza po naciśnięciu Enter w polu autouzupełniania
    document.getElementById('pickup-address').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
    });
    
    document.getElementById('delivery-address').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
    });
}

// Funkcja do obliczania trasy i odległości między adresami
function calculateRoute(pickupAddress, deliveryAddress) {
    return new Promise((resolve, reject) => {
        // Sprawdzenie czy adresy są poprawne
        if (!validateAddress(pickupAddress) || !validateAddress(deliveryAddress)) {
            reject(new Error('Wprowadź poprawne adresy odbioru i dostawy.'));
            return;
        }
        
        // Przygotowanie zapytania o trasę
        const request = {
            origin: pickupAddress,
            destination: deliveryAddress,
            travelMode: google.maps.TravelMode.DRIVING,
            region: config.geographicRestrictions.country,
            unitSystem: google.maps.UnitSystem.METRIC
        };
        
        // Wysłanie zapytania do Google Directions API
        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                // Wyświetlenie trasy na mapie
                directionsRenderer.setDirections(result);
                
                // Pobranie informacji o trasie
                const route = result.routes[0];
                const leg = route.legs[0];
                
                // Obliczenie odległości w kilometrach
                const distanceInKm = leg.distance.value / 1000;
                
                // Sprawdzenie czy odległość nie przekracza maksymalnej
                if (distanceInKm > config.pricing.maxDistance) {
                    reject(new Error(`Odległość przekracza maksymalny dystans ${config.pricing.maxDistance} km. Prosimy o kontakt w celu indywidualnej wyceny.`));
                    return;
                }
                
                // Przygotowanie danych do zwrócenia
                const routeData = {
                    distance: distanceInKm,
                    duration: leg.duration.value / 60, // Czas w minutach
                    startAddress: leg.start_address,
                    endAddress: leg.end_address,
                    startLocation: leg.start_location,
                    endLocation: leg.end_location
                };
                
                resolve(routeData);
            } else {
                // Obsługa błędów
                let errorMessage = 'Nie udało się obliczyć trasy.';
                
                switch (status) {
                    case google.maps.DirectionsStatus.NOT_FOUND:
                        errorMessage = 'Nie znaleziono jednego lub obu adresów. Sprawdź poprawność adresów.';
                        break;
                    case google.maps.DirectionsStatus.ZERO_RESULTS:
                        errorMessage = 'Nie znaleziono trasy między podanymi adresami.';
                        break;
                    case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                        errorMessage = 'Przekroczono maksymalną liczbę punktów trasy.';
                        break;
                    case google.maps.DirectionsStatus.INVALID_REQUEST:
                        errorMessage = 'Nieprawidłowe zapytanie o trasę.';
                        break;
                    case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                        errorMessage = 'Przekroczono limit zapytań do API. Spróbuj ponownie później.';
                        break;
                    case google.maps.DirectionsStatus.REQUEST_DENIED:
                        errorMessage = 'Zapytanie o trasę zostało odrzucone.';
                        break;
                    case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                        errorMessage = 'Wystąpił nieznany błąd. Spróbuj ponownie później.';
                        break;
                }
                
                reject(new Error(errorMessage));
            }
        });
    });
}

// Funkcja do sprawdzania czy adres jest w kraju z konfiguracji
function isAddressInCountry(address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                // Sprawdzenie czy adres jest w określonym kraju
                const isInCountry = results.some(result => {
                    return result.address_components.some(component => {
                        return component.types.includes('country') && 
                               component.short_name.toLowerCase() === config.geographicRestrictions.country.toLowerCase();
                    });
                });
                
                resolve(isInCountry);
            } else {
                reject(new Error('Nie udało się zweryfikować adresu.'));
            }
        });
    });
}

// Funkcja do obsługi formularza kalkulatora
function handleCalculatorForm() {
    const calculatorForm = document.getElementById('calculator-form');
    const resetButton = document.getElementById('reset-button');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    // Obsługa wysłania formularza
    calculatorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Pobranie wartości z formularza
        const pickupAddress = document.getElementById('pickup-address').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        
        // Pokazanie loadera, ukrycie wyników i błędów
        loadingSpinner.classList.add('show');
        resultsContainer.classList.remove('show');
        errorMessage.classList.remove('show');
        
        try {
            // Sprawdzenie czy adresy są w określonym kraju
            const [isPickupInCountry, isDeliveryInCountry] = await Promise.all([
                isAddressInCountry(pickupAddress),
                isAddressInCountry(deliveryAddress)
            ]);
            
            if (!isPickupInCountry || !isDeliveryInCountry) {
                throw new Error(`Kalkulator obsługuje tylko adresy w ${config.geographicRestrictions.country.toUpperCase()}.`);
            }
            
            // Obliczenie trasy
            const routeData = await calculateRoute(pickupAddress, deliveryAddress);
            
            // Obliczenie ceny
            const price = calculatePrice(routeData.distance);
            
            // Obliczenie szacowanego czasu dostawy
            const deliveryTime = estimateDeliveryTime(routeData.distance);
            
            // Aktualizacja wyników
            document.getElementById('pickup-address-result').textContent = routeData.startAddress;
            document.getElementById('delivery-address-result').textContent = routeData.endAddress;
            document.getElementById('distance-result').textContent = formatDistance(routeData.distance);
            document.getElementById('price-result').textContent = formatPrice(price);
            document.getElementById('price-breakdown').textContent = generatePriceBreakdown(routeData.distance);
            document.getElementById('time-result').textContent = formatTime(deliveryTime);
            
            // Pokazanie wyników
            resultsContainer.classList.add('show');
        } catch (error) {
            // Wyświetlenie błędu
            errorText.textContent = error.message;
            errorMessage.classList.add('show');
        } finally {
            // Ukrycie loadera
            loadingSpinner.classList.remove('show');
        }
    });
    
    // Obsługa przycisku reset
    resetButton.addEventListener('click', function() {
        calculatorForm.reset();
        resultsContainer.classList.remove('show');
        errorMessage.classList.remove('show');
        
        // Wyczyszczenie mapy
        if (directionsRenderer) {
            directionsRenderer.setDirections({ routes: [] });
        }
    });
    
    // Obsługa przycisków do czyszczenia pól
    document.querySelectorAll('.clear-input').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).value = '';
        });
    });
}

// Funkcja inicjalizująca aplikację po załadowaniu Google Maps API
function initApp() {
    initGoogleMaps();
    handleCalculatorForm();
}

// Eksportujemy funkcje do użycia w głównym skrypcie
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        calculateRoute,
        isAddressInCountry
    };
}
