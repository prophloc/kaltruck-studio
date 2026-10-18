// Distinct practical guides for Studio. Not copies of Premium's service descriptions.
// Facts about equipment are conditional; no unverified promises or fixed prices.
export interface Guide {
  heading: string;
  intro: string;
  preparation: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
}
export const guides: Record<string, Guide> = {
  'transport-hds': {
    heading: 'Jak zaplanować transport z żurawiem HDS?',
    intro: 'Sam przejazd to tylko jeden z etapów usługi HDS. Należy jeszcze ustalić, w jaki sposób samochód podejmie ładunek, jak zostanie on zabezpieczony podczas jazdy i gdzie będzie mógł zostać zdjęty z platformy. Połączenie tych czynności w jednym zleceniu może ograniczyć organizowanie kilku oddzielnych ekip.',
    preparation: [
      { title: 'Co będzie przewożone?', text: 'Przygotuj nazwę ładunku, możliwie dokładną masę, wymiary i zdjęcia. Istotne mogą być punkty do podnoszenia oraz to, czy przedmiot zawiera wyposażenie, które należy odłączyć lub unieruchomić.' },
      { title: 'Jak wygląda dojazd?', text: 'Warto podać obie lokalizacje i opisać szerokość wjazdu, rodzaj nawierzchni, ewentualne przewody nad trasą i miejsce na rozstawienie podpór. Warunki po obu stronach przejazdu mogą się znacznie różnić.' },
      { title: 'Gdzie ma stanąć ładunek?', text: 'Zaznacz miejsce docelowe i orientacyjną odległość od możliwego postoju samochodu. Dobór HDS zależy od wymaganej masy w konkretnym promieniu pracy, a nie od samej wartości maksymalnego udźwigu.' },
    ],
    faq: [
      { question: 'Czy transport HDS obejmuje również rozładunek?', answer: 'Zależnie od uzgodnionego zlecenia może obejmować załadunek, przejazd i rozładunek. Możliwość wykonania tych czynności potwierdzamy po sprawdzeniu parametrów ładunku.' },
      { question: 'Czy realizujecie zlecenia poza Płockiem?', answer: 'Bazą KALTRUCK jest Płock. Realizujemy także zlecenia krajowe, zależnie od trasy i dostępności terminu.' },
      { question: 'Czy do wyceny wystarczy sama waga?', answer: 'Nie. Pomagają także wymiary, adresy, zdjęcia terenu i informacja, w jakiej odległości od samochodu trzeba ustawić ładunek.' },
    ],
  },
  'transport-kontenerow': {
    heading: 'Kontener od odbioru do gotowego ustawienia',
    intro: 'Kontenery magazynowe, biurowe i socjalne różnią się konstrukcją oraz sposobem podnoszenia. W przypadku kontenera z wyposażeniem jego faktyczna masa może być większa niż masa podawana dla pustego modułu. Dlatego transport zaczynamy od ustalenia parametrów konkretnego obiektu i obu miejsc pracy.',
    preparation: [
      { title: 'Przygotowanie kontenera', text: 'Przed odbiorem ustal wymiary zewnętrzne, przybliżoną masę z wyposażeniem oraz dostępne punkty zaczepienia. Warto opisać, czy kontener jest pusty, czy wewnątrz znajdują się elementy wymagające zabezpieczenia.' },
      { title: 'Plac załadunku i odbioru', text: 'Szczególnie ważne są możliwość podjazdu samochodu, twarde i równe miejsce pod podpory HDS oraz brak przeszkód przy pracy ramienia. Zdjęcia bramy, podjazdu i najbliższego otoczenia pomagają we wstępnej ocenie.' },
      { title: 'Plan posadowienia', text: 'Przed przyjazdem wskaż dokładne miejsce ustawienia i przygotuj podłoże zgodnie z wymaganiami kontenera. Wysięg żurawia i możliwa masa podnoszenia muszą odpowiadać rzeczywistej odległości od pojazdu.' },
    ],
    faq: [
      { question: 'Czy HDS może ustawić kontener w ogrodzie lub za budynkiem?', answer: 'To zależy od dojazdu, zasięgu ramienia, masy kontenera i przeszkód na terenie. Potrzebna jest ocena konkretnej lokalizacji.' },
      { question: 'Czy przewozicie także wyposażone kontenery?', answer: 'Możliwość takiego przewozu ustalamy na podstawie masy całkowitej, rozmieszczenia wyposażenia i sposobu jego zabezpieczenia.' },
      { question: 'Co przesłać przed zamówieniem transportu kontenera?', answer: 'Najlepiej wymiary, masę, zdjęcia obiektu, adres odbioru i dostawy oraz fotografię miejsca planowanego ustawienia.' },
    ],
  },
  'transport-maszyn': {
    heading: 'Transport maszyny z uwzględnieniem jej konstrukcji',
    intro: 'Podczas przemieszczania maszyn ważna jest nie tylko masa. Znaczenie mają środek ciężkości, elementy wystające, możliwość zastosowania zawiesi i wskazówki producenta. Sprawdzamy te informacje przed zaplanowaniem załadunku, aby nie przyjmować jednego sposobu podnoszenia dla wszystkich urządzeń.',
    preparation: [
      { title: 'Dane maszyny', text: 'Do rozmowy o przewozie przygotuj model, wymiary, masę i zdjęcia urządzenia z każdej strony. Jeżeli dostępna jest dokumentacja transportowa producenta, informacje o punktach podnoszenia są szczególnie pomocne.' },
      { title: 'Przygotowanie do drogi', text: 'Trzeba ustalić, które elementy można zabezpieczyć lub zdemontować, jak unieruchomić ruchome części i czy maszynę należy odłączyć od instalacji. Konkretne czynności zależą od jej rodzaju.' },
      { title: 'Rozładunek w nowej lokalizacji', text: 'Opis przestrzeni, nawierzchni i docelowego miejsca pracy urządzenia pozwala ocenić, czy żuraw HDS wykona operację w wymaganym promieniu. Przy nietypowych gabarytach konieczny może być osobny plan.' },
    ],
    faq: [
      { question: 'Czy można przewieźć maszynę bez możliwości samodzielnego wjazdu na platformę?', answer: 'W niektórych przypadkach podjęcie urządzenia może być możliwe przy użyciu HDS. Decydują jego masa, konstrukcja i dopuszczalny sposób podnoszenia.' },
      { question: 'Czy dostarczacie maszyny poza Mazowsze?', answer: 'Rozpatrujemy także trasy ogólnopolskie. Warunki i termin zależą od konkretnego zlecenia.' },
      { question: 'Czy wystarczy podać typ maszyny?', answer: 'Nie zawsze. Dokładny model, masa, wymiary i zdjęcia pozwalają znacznie lepiej ocenić możliwość transportu.' },
    ],
  },
  'transport-prefabrykatow': {
    heading: 'Prefabrykaty i konstrukcje podnoszone według planu',
    intro: 'Prefabrykat betonowy, stalowy albo element infrastruktury wymaga właściwego podparcia i doboru punktów podnoszenia. Na budowie równie ważna jest przestrzeń manewrowa pojazdu, sposób rozładunku i kolejność ustawiania elementów. Te informacje warto zebrać jeszcze przed organizacją dostawy.',
    preparation: [
      { title: 'Dokumentacja elementu', text: 'Potrzebne są wymiary, masa oraz zalecenia producenta dotyczące zaczepów i pozycji transportowej. Niektóre prefabrykaty wymagają szczególnego podparcia podczas jazdy i rozładunku.' },
      { title: 'Warunki na placu budowy', text: 'Należy wskazać miejsce postoju ciężarówki, stan nawierzchni, ograniczenia dojazdu oraz przeszkody nad i obok stanowiska pracy. Istotny jest również promień, w którym trzeba podnieść i ustawić element.' },
      { title: 'Kolejność i zakres prac', text: 'Przy kilku prefabrykatach pomaga informacja o liczbie elementów i planowanej kolejności rozładunku. Można wtedy omówić ustawienie pojazdu oraz ograniczenie niepotrzebnego przemieszczania ładunków.' },
    ],
    faq: [
      { question: 'Czy transport prefabrykatów obejmuje ich ustawienie?', answer: 'Może obejmować rozładunek i ustawienie, jeśli parametry elementów i warunki miejsca pracy pozwalają na bezpieczną operację HDS.' },
      { question: 'Czy przewozicie elementy stalowe i betonowe?', answer: 'Takie materiały należą do zakresu rozpatrywanych realizacji. Szczegóły dobieramy do konkretnej masy, wymiarów i konstrukcji.' },
      { question: 'Jak przygotować informacje o dostawie na budowę?', answer: 'Pomogą rysunki lub zdjęcia elementów, ich masy, lokalizacja rozładunku i plan docelowego ustawienia.' },
    ],
  },
  'rozladunek-hds': {
    heading: 'Rozładunek wymaga miejsca na bezpieczny manewr',
    intro: 'Dostarczenie ciężkiego ładunku nie oznacza jeszcze, że można go bezpośrednio ustawić w wybranym punkcie. Przy rozładunku HDS liczą się dostęp do miejsca pracy, stabilne podłoże, przeszkody i odległość między pojazdem a ładunkiem. Dlatego przed terminem ustalamy warunki także wtedy, gdy transport organizuje inny dostawca.',
    preparation: [
      { title: 'Co należy zdjąć z pojazdu?', text: 'Podaj masę, wymiary, rodzaj opakowania i informacje o dopuszczalnych punktach podnoszenia. W przypadku urządzeń technicznych przydatne są zalecenia producenta.' },
      { title: 'Gdzie może stanąć HDS?', text: 'Potrzebujemy informacji o szerokości wjazdu, nawierzchni, przestrzeni na podpory oraz wszelkich przeszkodach. Zdjęcie miejsca postoju i rozładunku pozwala wstępnie ocenić wymagany wysięg.' },
      { title: 'Jak precyzyjne ma być ustawienie?', text: 'Warto opisać docelowy punkt i przygotowanie podłoża. Jeżeli element ma stanąć na fundamencie, podporach lub w ciasnym miejscu, należy to omówić przed realizacją.' },
    ],
    faq: [
      { question: 'Czy można zamówić tylko rozładunek bez transportu?', answer: 'Takie zlecenia można omówić indywidualnie. Zakres potwierdzamy po ustaleniu rodzaju ładunku i warunków pracy.' },
      { question: 'Czy HDS przełoży ładunek ponad ogrodzeniem?', answer: 'Jest to uzależnione od masy, odległości, wysokości przeszkody i bezpiecznej konfiguracji żurawia. Nie można tego zagwarantować bez danych z miejsca.' },
      { question: 'Jakie zdjęcia wysłać do wyceny?', answer: 'Najlepiej zdjęcia ładunku, całego wjazdu, możliwego postoju samochodu oraz punktu końcowego ustawienia.' },
    ],
  },
  'wynajem-hds': {
    heading: 'HDS z operatorem dobrany do zadania na miejscu',
    intro: 'Przy pracach przeładunkowych i montażowych nie zawsze potrzebny jest przewóz między adresami. Czasem kluczowe jest samo podniesienie, przeniesienie albo ustawienie elementu. Przed ustaleniem zakresu wynajmu analizujemy ciężar i odległość pracy oraz dostępność bezpiecznego stanowiska dla samochodu.',
    preparation: [
      { title: 'Opis czynności', text: 'Wskaż, co należy podnieść, skąd i dokąd przenieść oraz czy zadanie obejmuje także załadunek lub transport. Ważna jest liczba elementów i orientacyjny plan wykonania prac.' },
      { title: 'Masa i promień roboczy', text: 'Maksymalny udźwig podawany dla urządzenia nie jest dostępny na każdym wysięgu. Dlatego do oceny potrzebujemy faktycznej masy ładunku i odległości od planowanego postoju HDS.' },
      { title: 'Warunki wykonania', text: 'Opisz szerokość wjazdu, podłoże, przeszkody oraz wymaganą precyzję ustawienia. Przy pracach na placu budowy lub terenie przemysłowym trzeba uwzględnić także inne prowadzone roboty.' },
    ],
    faq: [
      { question: 'Czy możliwy jest wynajem HDS z samym operatorem?', answer: 'Usługa obejmuje sprzęt HDS z operatorem; dokładny zakres i wymagany czas pracy ustalamy indywidualnie.' },
      { question: 'Czy HDS można wykorzystać do ustawienia urządzenia technicznego?', answer: 'Możliwość zależy od masy, punktów podnoszenia, wymaganej odległości i warunków dostępu do miejsca pracy.' },
      { question: 'Od czego zależy wycena wynajmu HDS?', answer: 'Od rodzaju pracy, parametrów ładunku, miejsca realizacji, przewidywanego czasu i organizacji dojazdu.' },
    ],
  },
};
