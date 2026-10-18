// Photo lists faithfully derived from KALTRUCK Premium's 10 realization entries.
// Photos linked as /images/realizations in Premium's metadata but absent from
// both checked-in repos are deliberately omitted to avoid broken image URLs.
export const realizationGroups = [
  "Transport i montaż konstrukcji",
  "Budownictwo i infrastruktura",
  "Energetyka i przemysł",
  "Rolnictwo i rekreacja",
  "Reklama i wydarzenia"
] as const;
export type RealizationGroup = (typeof realizationGroups)[number];

export const realizations = [
  {
    "id": "01",
    "title": "Transport kontenera z rozładunkiem HDS",
    "category": "Kontenery",
    "image": "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-03.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-07.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-08.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-09.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-10.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-11.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-12.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-kontenerow-13.jpg"
    ],
    "alt": "Kontener ustawiany przy użyciu HDS KALTRUCK",
    "width": 1435,
    "height": 1080,
    "summary": "Profesjonalny transport i ustawianie kontenerów mieszkalnych, biurowych i magazynowych.",
    "group": "Transport i montaż konstrukcji"
  },
  {
    "id": "02",
    "title": "Transport ciężkiego prefabrykatu betonowego",
    "category": "Prefabrykaty",
    "image": "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-07.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-07.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-08.jpg",
      "https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-09.jpg"
    ],
    "alt": "Prefabrykat betonowy podczas realizacji HDS",
    "width": 813,
    "height": 1080,
    "summary": "Transport i ustawianie prefabrykatów betonowych na budowach i obiektach przemysłowych.",
    "group": "Budownictwo i infrastruktura"
  },
  {
    "id": "03",
    "title": "Transport stacji transformatorowej",
    "category": "Przemysł",
    "image": "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-05.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/stacje-transformatorowe-07.jpg"
    ],
    "alt": "Stacja transformatorowa przewożona i ustawiana HDS",
    "width": 813,
    "height": 1080,
    "summary": "Transport i montaż stacji transformatorowych oraz urządzeń dla branży energetycznej.",
    "group": "Energetyka i przemysł"
  },
  {
    "id": "04",
    "title": "Transport bębnów kablowych",
    "category": "Przemysł",
    "image": "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-04.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-bebnow-kablowych-05.jpg"
    ],
    "alt": "Bęben kablowy podczas transportu HDS",
    "width": 813,
    "height": 1080,
    "summary": "Sprawny transport bębnów kablowych dla inwestycji energetycznych i telekomunikacyjnych.",
    "group": "Energetyka i przemysł"
  },
  {
    "id": "05",
    "title": "Transport i montaż konstrukcji budowlanych",
    "category": "Konstrukcje",
    "image": "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-02.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-07.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-08.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-09.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-10.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-11.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-12.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-13.jpg",
      "https://hdsplock.pl/zdj/realizacje/domy-szkieletowe-14.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-07.jpg"
    ],
    "alt": "Konstrukcje i materiały budowlane podczas realizacji HDS",
    "width": 810,
    "height": 1080,
    "summary": "Transport, rozładunek i montaż konstrukcji drewnianych, elementów domów szkieletowych oraz materiałów budowlanych.",
    "group": "Budownictwo i infrastruktura"
  },
  {
    "id": "06",
    "title": "Transport domku holenderskiego",
    "category": "Nietypowe",
    "image": "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-06.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-04.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-05.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-06.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-07.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-domkow-holenderskich-08.jpg"
    ],
    "alt": "Domek holenderski obsługiwany przez HDS",
    "width": 813,
    "height": 1080,
    "summary": "Bezpieczny przewóz i ustawianie domków holenderskich oraz mobilnych obiektów mieszkalnych.",
    "group": "Transport i montaż konstrukcji"
  },
  {
    "id": "07",
    "title": "Montaż latarni i elementów infrastruktury",
    "category": "Montaż",
    "image": "https://hdsplock.pl/zdj/realizacje/montaz-latarni-03.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/montaz-latarni-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/montaz-latarni-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/montaz-latarni-03.jpg"
    ],
    "alt": "Montaż latarni z wykorzystaniem samochodu HDS",
    "width": 813,
    "height": 1080,
    "summary": "Ustawianie i montaż słupów oraz latarni z wykorzystaniem HDS.",
    "group": "Budownictwo i infrastruktura"
  },
  {
    "id": "08",
    "title": "Specjalistyczny transport przemysłowy",
    "category": "Przemysł",
    "image": "https://hdsplock.pl/zdj/realizacje/transport-przemys-owy-01.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/transport-przemys-owy-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-przemys-owy-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-przemys-owy-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/transport-przemys-owy-04.jpg"
    ],
    "alt": "Ciężki ładunek przemysłowy podczas realizacji KALTRUCK",
    "width": 810,
    "height": 1080,
    "summary": "Realizacje przemysłowe i nietypowe transporty HDS wymagające precyzyjnego ustawienia.",
    "group": "Energetyka i przemysł"
  },
  {
    "id": "09",
    "title": "Maszyny rolnicze",
    "category": "Rolnictwo",
    "image": "https://hdsplock.pl/zdj/realizacje/maszyny-rolnicze-01.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/maszyny-rolnicze-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/maszyny-rolnicze-02.jpg"
    ],
    "alt": "Transport ciężkiej maszyny rolniczej z wykorzystaniem HDS KALTRUCK",
    "width": 1920,
    "height": 863,
    "summary": "Transport ciężkich maszyn rolniczych i sprzętu wykorzystywanego w gospodarstwach.",
    "group": "Rolnictwo i rekreacja"
  },
  {
    "id": "10",
    "title": "Billboardy i reklamy",
    "category": "Reklama",
    "image": "https://hdsplock.pl/zdj/realizacje/billboardy-i-reklamy-01.jpg",
    "images": [
      "https://hdsplock.pl/zdj/realizacje/billboardy-i-reklamy-01.jpg",
      "https://hdsplock.pl/zdj/realizacje/billboardy-i-reklamy-02.jpg",
      "https://hdsplock.pl/zdj/realizacje/billboardy-i-reklamy-03.jpg",
      "https://hdsplock.pl/zdj/realizacje/billboardy-i-reklamy-04.jpg"
    ],
    "alt": "Montaż konstrukcji reklamowej z wykorzystaniem HDS KALTRUCK",
    "width": 813,
    "height": 1080,
    "summary": "Montaż konstrukcji reklamowych, billboardów i elementów ekspozycyjnych.",
    "group": "Reklama i wydarzenia"
  }
] as const;

export const galleryByGroup: Record<RealizationGroup, {src:string;alt:string;title:string;summary:string}[]> =
 Object.fromEntries(realizationGroups.map(group=>[group,realizations.filter(project=>project.group===group)
  .flatMap(project=>project.images.map((src,index)=>({
   src,alt:project.alt+' — zdjęcie '+(index+1)+' z '+project.images.length,
   title:project.title,summary:project.summary
  })))])) as Record<RealizationGroup,{src:string;alt:string;title:string;summary:string}[]>;
