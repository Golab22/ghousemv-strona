# ghousemv.com — strona GHouse Modern Vision

Statyczna strona (HTML + CSS + JS, bez budowania). Netlify publikuje ją automatycznie po każdej zmianie w tym repozytorium.

## Struktura

| Plik | Co to jest |
|---|---|
| `index.html` | Strona główna z animacją logo (intro raz na sesję) |
| `projektowanie.html` | Projekty indywidualne, nadzory, wsparcie dla firm, adaptacje, realizacje |
| `wykonczenia-scian.html` | Kolekcja paneli z filtrami i kartą produktu |
| `kontakt.html` | Dane firmy i formularz Netlify (`name="kontakt"`) |
| `dziekujemy.html` | Strona po wysłaniu formularza |
| `polityka-prywatnosci.html`, `404.html` | Strony pomocnicze |
| `css/site.css` | Wszystkie style (kolory w `:root` na górze pliku) |
| `js/site.js` | Menu mobilne, galeria, formularz, animacja intro |
| `img/kolekcja/` | Zdjęcia produktów (kody GH-xxx) |
| `sitemap.xml`, `robots.txt` | SEO, adresy bez `.html` |
| `netlify.toml` | Ustawienia Netlify (nagłówki, cache) |

## Zasady treści

- Na stronie **nie podajemy nazwy producenta paneli ani kodów fabrycznych**, tylko własne kody GH-xxx.
- Nie podajemy klasy ogniowej ani nie piszemy o certyfikatach. Dokumentacja techniczna jest „na zapytanie”.
- Nazwy inwestorów w realizacjach pojawiają się dopiero po ich zgodzie.

## Jak dodać zmianę

1. Edytuj plik (na GitHubie ikoną ołówka albo lokalnie).
2. Zapisz zmianę (commit) do gałęzi `main`.
3. Netlify sam opublikuje nową wersję w ok. minutę.

Formularze trafiają do Netlify: **Project → Forms**. Tam ustawisz powiadomienia e-mail.
