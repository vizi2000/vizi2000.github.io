// Konfiguracja kalkulatora dla wdrożenia
const config = {
  // Klucz API Google Maps - należy zastąpić rzeczywistym kluczem przed wdrożeniem
  googleMapsApiKey: 'AIzaSyBAeBW0GkudcQ-d5zfYPu5e1i3ef265KPI',
  
  // Parametry cenowe
  pricing: {
    basePrice: 25, // Cena za pierwsze 7 km
    baseDistance: 7, // Dystans objęty ceną podstawową
    additionalPricePerKm: 3.5, // Cena za każdy dodatkowy km
    maxDistance: 50 // Maksymalny dystans obsługiwany przez kalkulator
  },
  
  // Ograniczenia geograficzne
  geographicRestrictions: {
    country: 'pl' // Kod kraju (Polska)
  },
  
  // Parametry szacowania czasu dostawy
  deliveryTimeEstimation: {
    averageSpeedKmh: 30, // Średnia prędkość w km/h
    pickupAndDeliveryTimeMinutes: 10 // Dodatkowy czas na odbiór i dostawę
  }
};

// Eksportujemy konfigurację
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
