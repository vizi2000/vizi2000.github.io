# Wymagania dla kalkulatora cen kursu Xpress Delivery

## Funkcjonalność
1. Wprowadzanie adresu startowego (punkt odbioru)
2. Wprowadzanie adresu docelowego (punkt dostawy)
3. Obliczanie odległości między adresami w kilometrach
4. Wyliczanie ceny kursu według stawki:
   - 25 zł za pierwsze 7 km
   - 3,5 zł za każdy dodatkowy kilometr powyżej 7 km
5. Wyświetlanie wyników (odległość i cena)

## Wymagania techniczne
1. Integracja z Google Maps API do geokodowania adresów i obliczania odległości
2. Responsywny interfejs działający na urządzeniach mobilnych i desktopowych
3. Możliwość osadzenia kalkulatora na stronie Xpress Delivery
4. Szybkie działanie i natychmiastowe wyniki
5. Zgodność z identyfikacją wizualną Xpress Delivery (czarny, biały, żółty)

## Interfejs użytkownika
1. Dwa pola tekstowe do wprowadzania adresów
2. Przycisk do obliczania ceny
3. Sekcja wyników pokazująca:
   - Odległość w kilometrach
   - Cenę kursu w złotych
   - Rozbicie ceny (stawka podstawowa + dodatkowe kilometry)
4. Opcjonalnie: mapa pokazująca trasę

## Ograniczenia
1. Kalkulator powinien działać tylko dla tras w Polsce
2. Maksymalna odległość kursu: 50 km (dłuższe trasy wymagają indywidualnej wyceny)

## Integracja
1. Możliwość osadzenia na stronie głównej Xpress Delivery
2. Możliwość osadzenia w panelu klienta
3. Opcjonalnie: wersja do osadzenia na stronach partnerów
