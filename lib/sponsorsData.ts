export interface Sponsor {
  id: string;
  name: string;
  category: string;
  tier: string;
  logo: string;
  isPrimary?: boolean;
  instagramUrl?: string;
  phone?: string;
  location?: string;
}

export const SPONSORS: Sponsor[] = [
  {
    id: 'don-mateador',
    name: 'Don Mateador',
    category: 'Mates, Termos & Bombillas',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/don-mateador.jpeg',
    instagramUrl: 'https://www.instagram.com/donmateador__/',
  },
  {
    id: 'la-mecha',
    name: 'La Mecha',
    category: 'Carnes, Embutidos & Congelados',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/la-mecha.jpeg',
    instagramUrl: 'https://www.instagram.com/lamecha.cec/',
  },
  {
    id: 'sc-catering',
    name: 'SC Cátering & Eventos',
    category: 'Servicio de Cátering y Eventos',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/sc-catering.jpeg',
    instagramUrl: 'https://www.instagram.com/scateringalcorta/',
  },
  {
    id: 'iphone-alcorta',
    name: 'iPhone Alcorta',
    category: 'Telefonía & Accesorios Apple',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/iphone-alcorta.jpeg',
    instagramUrl: 'https://www.instagram.com/iphone_alcorta/',
  },
  {
    id: 'casa-bonis',
    name: 'Casa Bonis',
    category: 'Hogar, Muebles & Confort',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/casa-bonis.jpeg',
    instagramUrl: 'https://www.instagram.com/casabonis/',
  },
  {
    id: 'mascambroni-acevedo',
    name: 'Mascambroni & Acevedo S.H.',
    category: 'Servicios Agropecuarios • Cosecha, Siembra & Fertilización',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/mascambroni-acevedo.jpeg',
  },
  {
    id: 'geraci-materiales',
    name: 'Geraci Materiales',
    category: 'Hormigón Elaborado & Materiales',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/geraci-materiales.jpeg',
    instagramUrl: 'https://www.instagram.com/geracimateriales/',
  },
  {
    id: 'supersol',
    name: 'SuperSol Alcorta',
    category: 'Autoservicio & Supermercado',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/supersol.jpeg',
    instagramUrl: 'https://www.instagram.com/supersol_de_alcorta/',
  },
  {
    id: 'shell-santa-catalina',
    name: 'Shell Santa Catalina',
    category: 'Combustibles & Estación de Servicio',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/shell-santa-catalina.jpeg',
  },
  {
    id: 'lucas-oriolo',
    name: 'Lic. Lucas Oriolo',
    category: 'Kinesiología & Fisiatría (Mat. 2509/2)',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/lucas-oriolo.png',
  },
  {
    id: 'milers-fragancias',
    name: 'Milers Fragancias',
    category: 'Fragancias & Perfumería • Jazmín Milevcic',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/milers-fragancias.png',
    instagramUrl: 'https://www.instagram.com/milers_fragancias/',
  },
  {
    id: 'kinesiologia-ranzuglia',
    name: 'Lic. Sebastián Ranzuglia',
    category: 'Kinesiología & Fisiatría (Mat. 430)',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/kinesiologia-ranzuglia.jpeg',
  },
  {
    id: 'maria-juana',
    name: 'María Juana',
    category: 'Indumentaria & Regalería',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/maria-juana.jpeg',
  },
];
