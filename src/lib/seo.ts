import { site, services } from '../data/site';

// Every absolute SEO URL derives from the configured production HTTPS origin.
// During local development (no PUBLIC_SITE_URL), pages remain non-indexable.
export const defaultOgImage = 'https://raw.githubusercontent.com/prophloc/kaltruck-premium/main/public/images/home/hero-hds-original.png';
export const mapsLocation = 'https://www.google.com/maps/search/?api=1&query=Tokarska%2040%2C%2009-401%20P%C5%82ock';
const facebook = 'https://www.facebook.com/profile.php?id=61561070733012';
const instagram = 'https://www.instagram.com/transporthdsplock/';
const coverage = ['Płock', 'województwo mazowieckie', 'województwo kujawsko-pomorskie', 'województwo łódzkie', 'województwo wielkopolskie', 'Polska'];
const absolute = (path: string) => new URL(path, site.url!).toString();

export interface SeoBreadcrumb { name: string; path: string; }

const staticLabels: Record<string, string> = {
  '/realizacje/': 'Realizacje',
  '/sprzet/': 'Sprzęt HDS',
  '/o-nas/': 'O firmie',
  '/kontakt/': 'Kontakt i wycena',
};
export const serviceSeo: Record<string, { title: string; description: string }> = {
  'transport-hds': {
    title: 'Transport HDS Płock — załadunek i przewóz | KALTRUCK',
    description: 'Transport HDS z Płocka: planowanie załadunku, przewozu i rozładunku kontenerów, maszyn oraz konstrukcji. Obsługa Mazowsza i tras krajowych.',
  },
  'transport-kontenerow': {
    title: 'Transport kontenerów HDS Płock i Polska | KALTRUCK',
    description: 'Transport kontenerów magazynowych, mieszkalnych i technicznych z rozładunkiem HDS. Uzgadniamy dojazd, podłoże oraz miejsce docelowego ustawienia.',
  },
  'transport-maszyn': {
    title: 'Transport maszyn HDS — Płock i cała Polska | KALTRUCK',
    description: 'Transport maszyn budowlanych, rolniczych i urządzeń przemysłowych. Dobieramy sposób podnoszenia oraz zabezpieczenia do masy i wymiarów ładunku.',
  },
  'transport-prefabrykatow': {
    title: 'Transport prefabrykatów i konstrukcji HDS | KALTRUCK',
    description: 'Przewóz i rozładunek prefabrykatów betonowych, stalowych i elementów konstrukcyjnych. Planowanie pracy HDS z uwzględnieniem zasięgu i placu budowy.',
  },
  'rozladunek-hds': {
    title: 'Rozładunek HDS i ustawianie ładunków Płock | KALTRUCK',
    description: 'Rozładunek HDS kontenerów, maszyn, Big-Bagów oraz materiałów budowlanych. Pomagamy ustalić miejsce postoju i warunki bezpiecznego ustawienia ładunku.',
  },
  'wynajem-hds': {
    title: 'Wynajem HDS z operatorem — Płock i Polska | KALTRUCK',
    description: 'Wynajem samochodu HDS z operatorem do prac montażowych i przeładunkowych. Opisz ładunek, wymagany wysięg i warunki dojazdu, aby omówić realizację.',
  },
};

export function breadcrumbsFor(path: string): SeoBreadcrumb[] {
  if (path === '/') return [];
  const currentService = services.find((s) => path === '/uslugi/' + s.slug + '/');
  if (currentService) return [
    { name: 'Start', path: '/' },
    { name: currentService.title, path },
  ];
  return [{ name: 'Start', path: '/' }, { name: staticLabels[path] || 'KALTRUCK', path }];
}

export function breadcrumbSchema(items: SeoBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absolute('/#firma'),
    name: site.legalName,
    alternateName: site.name,
    url: absolute('/'),
    logo: absolute('/brand/kaltruck-logo.svg'),
    image: defaultOgImage,
    description: 'Specjalistyczny transport, załadunek i rozładunek żurawiem HDS — Płock i cała Polska.',
    telephone: site.phone,
    vatID: site.nip,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tokarska 40',
      postalCode: '09-401',
      addressLocality: 'Płock',
      addressRegion: 'mazowieckie',
      addressCountry: 'PL',
    },
    hasMap: mapsLocation,
    sameAs: [facebook, instagram],
    areaServed: coverage.map((name) => ({ '@type': name === 'Polska' ? 'Country' : 'AdministrativeArea', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Usługi transportowe KALTRUCK',
      itemListElement: services.map((s) => ({
        '@type': 'OfferCatalog',
        name: s.title,
        url: absolute('/uslugi/' + s.slug + '/'),
      })),
    },
  };
}
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absolute('/#strona'),
    url: absolute('/'),
    name: 'KALTRUCK Studio',
    inLanguage: 'pl-PL',
    publisher: { '@id': absolute('/#firma') },
  };
}
export function webpageSchema(path: string, title: string, description: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absolute(path) + '#strona',
    url: absolute(path),
    name: title,
    description,
    inLanguage: 'pl-PL',
    isPartOf: { '@id': absolute('/#strona') },
    about: { '@id': absolute('/#firma') },
    primaryImageOfPage: { '@type': 'ImageObject', url: image },
    ...(path !== '/' ? { breadcrumb: { '@id': absolute(path) + '#breadcrumbs' } } : {}),
  };
}
export function serviceSchema(slug: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absolute('/uslugi/' + slug + '/') + '#usluga',
    name,
    description,
    serviceType: name,
    url: absolute('/uslugi/' + slug + '/'),
    provider: { '@id': absolute('/#firma') },
    areaServed: coverage.map((region) => ({ '@type': region === 'Polska' ? 'Country' : 'AdministrativeArea', name: region })),
  };
}
export function buildPageSchemas(path: string, title: string, description: string, image: string, extras: unknown[] = []) {
  if (!site.url) return [];
  const crumbs = breadcrumbsFor(path);
  return [
    localBusinessSchema(),
    websiteSchema(),
    webpageSchema(path, title, description, image),
    ...(crumbs.length ? [{ ...breadcrumbSchema(crumbs), '@id': absolute(path) + '#breadcrumbs' }] : []),
    ...extras,
  ];
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
