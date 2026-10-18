export const site = {
  name: 'KALTRUCK',
  legalName: 'Transport HDS Kalwasińscy',
  phone: '+48 514 948 373',
  phoneHref: '+48514948373',
  secondPhone: '+48 784 430 022',
  secondPhoneHref: '+48784430022',
  email: 'hds.plock@gmail.com',
  city: 'Płock',
  url: import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '') || null,
};

export const projects = [
  { id: '01', category: 'Kontenery', title: 'Transport i ustawienie kontenera', image: 'https://hdsplock.pl/zdj/realizacje/transport-kontenerow-03.jpg', alt: 'Kontener ustawiany przy użyciu HDS KALTRUCK' },
  { id: '02', category: 'Budownictwo', title: 'Transport ciężkiego prefabrykatu', image: 'https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-07.jpg', alt: 'Prefabrykat betonowy podczas prac HDS' },
  { id: '03', category: 'Przemysł', title: 'Prace przy stacji transformatorowej', image: 'https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-05.jpg', alt: 'Transport i ustawianie stacji transformatorowej' },
  { id: '04', category: 'Przemysł', title: 'Transport bębnów kablowych', image: 'https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-04.jpg', alt: 'Transport bębna kablowego z użyciem HDS' },
  { id: '05', category: 'Konstrukcje', title: 'Montaż konstrukcji drewnianej', image: 'https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-02.jpg', alt: 'Konstrukcja domu szkieletowego' },
  { id: '06', category: 'Transport', title: 'Transport domku holenderskiego', image: 'https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-06.jpg', alt: 'Transport domku holenderskiego HDS' },
  { id: '07', category: 'Montaż', title: 'Montaż infrastruktury drogowej', image: 'https://hdsplock.pl/zdj/realizacje/montaz-latarni-03.jpg', alt: 'Montaż latarni z użyciem żurawia' }
] as const;

export const services = [
  { slug: 'transport-hds', number: '01', title: 'Transport HDS', tagline: 'Załadunek, przewóz i rozładunek', description: 'Przewóz materiałów, konstrukcji i ładunków wymagających pracy żurawiem samochodowym.', details: ['Transport lokalny i krajowy', 'Obsługa firm i klientów indywidualnych', 'Załadunek i rozładunek HDS'], image: projects[0].image },
  { slug: 'transport-kontenerow', number: '02', title: 'Transport kontenerów', tagline: 'Od odbioru do ustawienia', description: 'Przewóz kontenerów, zapleczy budowy i elementów modułowych z rozładunkiem na miejscu.', details: ['Kontenery techniczne i magazynowe', 'Rozładunek i posadowienie', 'Planowanie miejsca ustawienia'], image: projects[0].image },
  { slug: 'transport-maszyn', number: '03', title: 'Transport maszyn', tagline: 'Duży ciężar. Pełna kontrola.', description: 'Transport maszyn budowlanych i rolniczych, urządzeń technicznych oraz sprzętu przemysłowego.', details: ['Maszyny budowlane', 'Maszyny rolnicze', 'Urządzenia przemysłowe'], image: projects[3].image },
  { slug: 'transport-prefabrykatow', number: '04', title: 'Transport prefabrykatów', tagline: 'Precyzja na budowie', description: 'Transport i osadzanie prefabrykatów betonowych, stalowych i innych elementów konstrukcyjnych.', details: ['Prefabrykaty betonowe', 'Elementy konstrukcyjne', 'Rozładunek na placu budowy'], image: projects[1].image },
  { slug: 'rozladunek-hds', number: '05', title: 'Rozładunek HDS', tagline: 'Sprawna obsługa dostaw', description: 'Prace przeładunkowe, podnoszenie i ustawianie materiałów lub urządzeń.', details: ['Palety i Big-Bagi', 'Elementy konstrukcyjne', 'Precyzyjne ustawianie ładunku'], image: projects[2].image },
  { slug: 'wynajem-hds', number: '06', title: 'Wynajem HDS z operatorem', tagline: 'Sprzęt i doświadczenie', description: 'Prace montażowe i przeładunkowe wymagające żurawia hydraulicznego z operatorem.', details: ['Prace montażowe', 'Obsługa inwestycji', 'Indywidualne wyceny'], image: projects[4].image },
] as const;
