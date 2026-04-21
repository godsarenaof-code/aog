export type RankTier = 'IV' | 'III' | 'II' | 'I';

export interface RankInfo {
  name: string;
  icon: string;
  minLp: number;
  maxLp: number;
  hasSubtiers: boolean;
  color: string;
  imageUrl: string;
}

export const RANK_CONFIG: RankInfo[] = [
  // Tiers com subníveis (IV - I)
  // Assumindo que cada subnível precisa de 25 LP (aprox. 3-4 vitórias)
  { name: 'Mortal', icon: '🌑', minLp: -400, maxLp: -301, hasSubtiers: true, color: 'text-slate-400', imageUrl: '/assets/ranks/mortal.png' },
  { name: 'Ascendente', icon: '🔥', minLp: -300, maxLp: -201, hasSubtiers: true, color: 'text-orange-500', imageUrl: '/assets/ranks/ascendente.png' },
  { name: 'Iluminado', icon: '⚡', minLp: -200, maxLp: -101, hasSubtiers: true, color: 'text-yellow-400', imageUrl: '/assets/ranks/iluminado.png' },
  { name: 'Arcano', icon: '🌀', minLp: -100, maxLp: -1, hasSubtiers: true, color: 'text-purple-500', imageUrl: '/assets/ranks/arcano.png' },
  
  // Tiers por pontos (Como solicitado: 0-300, 301-430, 431+)
  { name: 'Celestial', icon: '👁️', minLp: 0, maxLp: 300, hasSubtiers: false, color: 'text-cyan-400', imageUrl: '/assets/ranks/celestial.png' },
  { name: 'Transcendente', icon: '🌌', minLp: 301, maxLp: 430, hasSubtiers: false, color: 'text-indigo-400', imageUrl: '/assets/ranks/transcendente.png' },
  { name: 'Divino', icon: '👑', minLp: 431, maxLp: 999999, hasSubtiers: false, color: 'text-amber-400', imageUrl: '/assets/ranks/divino.png' },
];

export function getRankFromLp(lp: number) {
  const rank = RANK_CONFIG.find(r => lp >= r.minLp && lp <= r.maxLp) || RANK_CONFIG[0];
  
  if (!rank.hasSubtiers) {
    return { name: rank.name, icon: rank.icon, full: rank.name, color: rank.color, imageUrl: rank.imageUrl };
  }

  // Lógica para subníveis (IV, III, II, I)
  // Cada tier tem 100 LP de range, 25 LP por subnível
  const range = rank.maxLp - rank.minLp + 1;
  const progress = lp - rank.minLp;
  const tierIndex = Math.floor(progress / (range / 4));
  const tiers: RankTier[] = ['IV', 'III', 'II', 'I'];
  const tier = tiers[Math.min(tierIndex, 3)];

  return {
    name: rank.name,
    tier,
    icon: rank.icon,
    full: `${rank.name} ${tier}`,
    color: rank.color
  };
}

export const PROGRESSION = {
  WIN: [+8, +7, +6, +5], // 1º, 2º, 3º, 4º
  LOSS: [-2, -3, -4, -5], // 5º, 6º, 7º, 8º
  FORFEIT: -10
};
