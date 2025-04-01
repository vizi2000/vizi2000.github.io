# Instrukcja wdrożenia kalkulatora cen kursu Xpress Delivery

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Wymagania](#wymagania)
3. [Instalacja](#instalacja)
4. [Konfiguracja](#konfiguracja)
5. [Osadzenie na stronie](#osadzenie-na-stronie)
6. [Dostosowanie wyglądu](#dostosowanie-wyglądu)
7. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Wprowadzenie

Kalkulator cen kursu Xpress Delivery to narzędzie umożliwiające klientom obliczenie ceny dostawy na podstawie adresu odbioru i dostawy. Kalkulator wykorzystuje Google Maps API do obliczania odległości między adresami i wyświetlania trasy na mapie.

Główne funkcje kalkulatora:
- Wprowadzanie adresu odbioru i dostawy
- Autouzupełnianie adresów
- Obliczanie odległości między adresami
- Wyliczanie ceny kursu według stawki: 25 zł za pierwsze 7 km + 3,5 zł za każdy dodatkowy kilometr
- Wyświetlanie trasy na mapie
- Szacowanie czasu dostawy

## Wymagania

Do poprawnego działania kalkulatora potrzebne są:
1. Klucz API Google Maps z włączonymi usługami:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
2. Serwer WWW do hostowania plików kalkulatora
3. Podstawowa znajomość HTML i JavaScript

## Instalacja

1. Rozpakuj archiwum `xpress_delivery_calculator.zip` na swoim serwerze WWW.
2. Struktura plików powinna wyglądać następująco:
   ```
   xpress_delivery_calculator/
   ├── index.html
   ├── calculator.js
   ├── maps-integration.js
   └── config.js
   ```

## Konfiguracja

### Uzyskanie klucza API Google Maps

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Przejdź do sekcji "APIs & Services" > "Library"
4. Włącz następujące API:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
5. Przejdź do sekcji "APIs & Services" > "Credentials"
6. Kliknij "Create credentials" > "API key"
7. Skopiuj wygenerowany klucz API
8. Zalecane: Ogranicz klucz API do:
   - Określonych domen (HTTP referrers)
   - Tylko wymaganych API

### Konfiguracja kalkulatora

1. Otwórz plik `config.js` w edytorze tekstu
2. Zastąp `YOUR_API_KEY` swoim kluczem API Google Maps:
   ```javascript
   googleMapsApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
   ```
3. Dostosuj pozostałe parametry według potrzeb:
   - `pricing`: parametry cenowe
   - `geographicRestrictions`: ograniczenia geograficzne
   - `deliveryTimeEstimation`: parametry szacowania czasu dostawy

## Osadzenie na stronie

### Opcja 1: Osadzenie jako samodzielna strona

Wystarczy umieścić wszystkie pliki na serwerze i udostępnić link do `index.html`.

### Opcja 2: Osadzenie w istniejącej stronie za pomocą iframe

Dodaj poniższy kod HTML w miejscu, gdzie ma być wyświetlany kalkulator:

```html
<iframe src="ścieżka/do/xpress_delivery_calculator/index.html" 
        width="100%" 
        height="800px" 
        frameborder="0" 
        scrolling="no">
</iframe>
```

### Opcja 3: Integracja z kodem strony

1. Dodaj następujące pliki CSS w sekcji `<head>` swojej strony:
   ```html
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
   ```

2. Skopiuj zawartość pliku `index.html` między znacznikami `<div class="calculator-container">` i `</div>` do swojej strony.

3. Dodaj style CSS z pliku `index.html` do swojego arkusza stylów.

4. Dodaj następujące skrypty JavaScript na końcu swojej strony, przed zamykającym znacznikiem `</body>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
   <script src="ścieżka/do/config.js"></script>
   <script src="ścieżka/do/calculator.js"></script>
   <script src="ścieżka/do/maps-integration.js"></script>
   <script>
       document.addEventListener('DOMContentLoaded', function() {
           const script = document.createElement('script');
           script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=places&callback=initApp`;
           script.async = true;
           script.defer = true;
           document.body.appendChild(script);
       });
   </script>
   ```

## Dostosowanie wyglądu

Kalkulator można dostosować do identyfikacji wizualnej Xpress Delivery, modyfikując style CSS w pliku `index.html`.

Główne kolory używane w kalkulatorze:
- Czarny: `#000000` (--xd-black)
- Żółty: `#FFD100` (--xd-yellow)
- Biały: `#FFFFFF` (--xd-white)
- Szary: `#F8F9FA` (--xd-gray)
- Ciemny szary: `#343A40` (--xd-dark-gray)

Aby zmienić kolory, zmodyfikuj wartości zmiennych CSS w sekcji `:root` w pliku `index.html`.

## Rozwiązywanie problemów

### Mapa nie wyświetla się

1. Sprawdź, czy klucz API Google Maps jest poprawny
2. Upewnij się, że wszystkie wymagane API są włączone
3. Sprawdź konsolę przeglądarki (F12) w poszukiwaniu błędów

### Nie można obliczyć trasy

1. Upewnij się, że wprowadzone adresy są poprawne
2. Sprawdź, czy adresy znajdują się w Polsce (lub zmodyfikuj ograniczenie geograficzne w `config.js`)
3. Upewnij się, że odległość między adresami nie przekracza maksymalnej (domyślnie 50 km)

### Problemy z autouzupełnianiem adresów

1. Sprawdź, czy Places API jest włączone
2. Upewnij się, że klucz API ma odpowiednie uprawnienia

W przypadku innych problemów, prosimy o kontakt z zespołem wsparcia Xpress Delivery.
