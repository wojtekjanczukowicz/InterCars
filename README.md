# InterCars – Testy automatyczne (Playwright)

## 📌 Opis projektu

Projekt zawiera automatyczny test scenariusza zakupowego dla strony InterCars z wykorzystaniem Playwright i TypeScript.

Test odwzorowuje rzeczywisty flow użytkownika:

* wejście na stronę
* akceptacja cookies
* przejście do kategorii
* wybór największej kategorii (na podstawie liczby produktów)
* zastosowanie filtra
* dodanie produktów do koszyka
* weryfikacja danych w koszyku (nazwa, cena, suma)

---

## 🧱 Architektura

Projekt wykorzystuje podejście Page Object Model (POM):

* `pages/` – logika interakcji ze stroną (Home, Category, Filter, Product, Cart)
* `tests/` – scenariusze testowe
* `utils/` – funkcje pomocnicze (np. parsowanie ceny, obsługa captcha)

Dzięki temu:

* testy są czytelne
* selektory są odseparowane od logiki
* kod jest łatwiejszy w utrzymaniu

---

## ⚙️ Technologie

* Playwright
* TypeScript
* Node.js

---

## ▶️ Uruchomienie

```bash
npm install
npx playwright install
npx playwright test
```

---

## ⚠️ Uwagi / ograniczenia

* Strona korzysta z zabezpieczeń (Cloudflare / captcha), które mogą wymagać:

  * ręcznej interakcji (`page.pause()`)
  * ponownego uruchomienia testu

* Strona jest dynamiczna, więc:

  * zastosowano waity i retry
  * selektory są możliwie odporne, ale mogą wymagać aktualizacji

---

## ✅ Walidacje w teście

Test sprawdza:

* poprawne pobranie liczby produktów w kategorii
* poprawność filtrów
* dodanie produktów do koszyka
* zgodność nazw produktów
* zgodność cen
* poprawność sumy koszyka

---

## 🚀 Możliwe rozszerzenia

* mockowanie API (większa stabilność testów)
* integracja z CI (GitHub Actions)
* testy równoległe
* rozszerzenie o kolejne scenariusze (logowanie, checkout)

---

## 🎯 Cel projektu

Projekt został przygotowany jako demonstracja umiejętności:

* automatyzacji testów E2E
* pracy z dynamiczną stroną e-commerce
* radzenia sobie z problemami typu captcha / niestabilność
* projektowania struktury testów (POM)
