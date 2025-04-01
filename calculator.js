// Aktualizacja kalkulatora, aby korzystał z pliku konfiguracyjnego

// Stałe cenowe z konfiguracji
const BASE_PRICE = config.pricing.basePrice;
const BASE_DISTANCE = config.pricing.baseDistance;
const ADDITIONAL_PRICE_PER_KM = config.pricing.additionalPricePerKm;
const MAX_DISTANCE = config.pricing.maxDistance;

// Funkcja do obliczania ceny kursu na podstawie odległości
function calculatePrice(distanceInKm) {
    // Zaokrąglamy odległość do 1 miejsca po przecinku
    distanceInKm = Math.round(distanceInKm * 10) / 10;
    
    // Sprawdzamy czy odległość nie przekracza maksymalnej
    if (distanceInKm > MAX_DISTANCE) {
        throw new Error(`Odległość przekracza maksymalny dystans ${MAX_DISTANCE} km. Prosimy o kontakt w celu indywidualnej wyceny.`);
    }
    
    // Obliczamy cenę
    let totalPrice = BASE_PRICE;
    
    // Jeśli odległość przekracza dystans podstawowy, dodajemy opłatę za dodatkowe kilometry
    if (distanceInKm > BASE_DISTANCE) {
        const additionalDistance = distanceInKm - BASE_DISTANCE;
        const additionalPrice = additionalDistance * ADDITIONAL_PRICE_PER_KM;
        totalPrice += additionalPrice;
    }
    
    // Zaokrąglamy cenę do 2 miejsc po przecinku
    return Math.round(totalPrice * 100) / 100;
}

// Funkcja do generowania opisu rozbicia ceny
function generatePriceBreakdown(distanceInKm) {
    distanceInKm = Math.round(distanceInKm * 10) / 10;
    
    if (distanceInKm <= BASE_DISTANCE) {
        return `Stawka podstawowa (do ${BASE_DISTANCE} km): ${BASE_PRICE.toFixed(2)} zł`;
    } else {
        const additionalDistance = distanceInKm - BASE_DISTANCE;
        const additionalPrice = additionalDistance * ADDITIONAL_PRICE_PER_KM;
        return `Stawka podstawowa (${BASE_DISTANCE} km): ${BASE_PRICE.toFixed(2)} zł + Dodatkowe ${additionalDistance.toFixed(1)} km: ${additionalPrice.toFixed(2)} zł`;
    }
}

// Funkcja do szacowania czasu dostawy (przybliżone wartości)
function estimateDeliveryTime(distanceInKm) {
    // Pobieramy parametry z konfiguracji
    const averageSpeedKmh = config.deliveryTimeEstimation.averageSpeedKmh;
    const pickupAndDeliveryTimeMinutes = config.deliveryTimeEstimation.pickupAndDeliveryTimeMinutes;
    
    // Czas jazdy w minutach
    const drivingTimeMinutes = (distanceInKm / averageSpeedKmh) * 60;
    
    // Dodajemy czas na odbiór i dostawę
    const totalTimeMinutes = drivingTimeMinutes + pickupAndDeliveryTimeMinutes;
    
    // Zaokrąglamy do pełnych minut
    return Math.round(totalTimeMinutes);
}

// Funkcja do formatowania odległości
function formatDistance(distanceInKm) {
    return `${distanceInKm.toFixed(1)} km`;
}

// Funkcja do formatowania ceny
function formatPrice(price) {
    return `${price.toFixed(2)} zł`;
}

// Funkcja do formatowania czasu
function formatTime(timeInMinutes) {
    if (timeInMinutes < 60) {
        return `${timeInMinutes} min`;
    } else {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours} godz ${minutes} min`;
    }
}

// Funkcja do walidacji adresu (podstawowa)
function validateAddress(address) {
    // Sprawdzamy czy adres nie jest pusty
    if (!address || address.trim() === '') {
        return false;
    }
    
    // Sprawdzamy minimalną długość adresu
    if (address.trim().length < 5) {
        return false;
    }
    
    return true;
}

// Eksportujemy funkcje do użycia w głównym skrypcie
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePrice,
        generatePriceBreakdown,
        estimateDeliveryTime,
        formatDistance,
        formatPrice,
        formatTime,
        validateAddress,
        BASE_PRICE,
        BASE_DISTANCE,
        ADDITIONAL_PRICE_PER_KM,
        MAX_DISTANCE
    };
}
