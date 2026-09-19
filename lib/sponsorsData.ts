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
    id: 'roller-design',
    name: 'Roller Design Alcorta',
    category: 'Cortinas Blackout & Screen',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/roller-design.jpeg',
    instagramUrl: 'https://www.instagram.com/roller_design_alcorta/',
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
    id: 'grido-alcorta',
    name: 'Grido Alcorta',
    category: 'Heladería & Postres',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/grido-alcorta.jpeg',
  },
  {
    id: 'vida-gym',
    name: 'Vida Gym',
    category: 'Gimnasio & Entrenamiento',
    tier: 'SPONSOR OFICIAL',
    logo: '/sponsors/vida-gym.jpeg',
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
