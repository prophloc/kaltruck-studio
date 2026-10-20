# KALTRUCK Studio — formularz kontaktowy na cPanel

Strona `/kontakt/` wysyła żądanie `POST /kontakt-wyslij.php` zamiast otwierać aplikację `mailto:`. Skrypt PHP znajduje się w `public/kontakt-wyslij.php` i automatycznie trafia do katalogu głównego wygenerowanej paczki `dist/`.

## Po wdrożeniu

1. Wgraj **całą nową paczkę produkcyjną** do katalogu głównego domeny `transportplockhds.pl` na cPanel, w tym `kontakt-wyslij.php`. Wymagany jest hosting uruchamiający PHP (nie czysty hosting statyczny).
2. W cPanel sprawdź działanie PHP oraz lokalnej funkcji `mail()` / transportu poczty. Nadawca wiadomości to `formularz@transportplockhds.pl`, a stały odbiorca to `hds.plock@gmail.com`. Nadawca powinien należeć do domeny i mieć poprawnie skonfigurowane SPF/DKIM, żeby Gmail akceptował pocztę z serwera. Jeśli dostawca wymaga autoryzowanego SMTP, należy zintegrować SMTP po stronie serwera zamiast publikować hasło w plikach frontendu.
3. Otwórz `https://transportplockhds.pl/kontakt/` i wyślij zapytanie testowe ze swoim adresem e-mail lub numerem telefonu. Sprawdź w Gmailu także folder Spam. Odpowiedź formularza oznacza tylko akceptację przez hosting; nie potwierdza dotarcia do odbiorcy.
4. Jeśli pojawia się błąd, sprawdź `DevTools → Network → kontakt-wyslij.php`, odpowiedź HTTP oraz dziennik błędów PHP w cPanel. `404` to zła ścieżka wdrożenia; `405` przy samym wejściu GET jest prawidłowe; `503` podczas POST może oznaczać niedostępny `mail()` lub problem z zapisem do katalogu tymczasowego.
5. Na czas prób zachowaj kopię poprzedniej działającej strony. Nie publikuj haseł SMTP, tokenów i danych klientów w publicznym repozytorium GitHub.

Skrypt waliduje pola, ogranicza liczbę zgłoszeń na IP, sprawdza origin/referrer oraz używa ukrytego pola antyspamowego. Nie przechowuje treści zgłoszeń na serwerze. Limit czasowy jest przechowywany w katalogu tymczasowym PHP w postaci znacznika czasu, bez danych formularza.

`mailto:hds.plock@gmail.com` pozostaje bezpośrednim linkiem do ręcznego kontaktu jako alternatywa.
