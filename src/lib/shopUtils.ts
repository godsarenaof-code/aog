import { Champion } from '@/lib/data';

/**
 * Gera uma lista de campeões para a loja com RNG inteligente.
 * @param allChampions Lista completa de campeões disponíveis.
 * @param teamTraits Lista de nomes das características (origins/classes) já presentes no time.
 * @param shopSize Tamanho da loja (padrão 5).
 * @returns Array de campeões selecionados.
 */
export function generateShop(
  allChampions: any[],
  teamTraits: string[] = [],
  shopSize: number = 5
): any[] {
  if (!allChampions || allChampions.length === 0) return [];

  const shop: any[] = [];
  
  for (let i = 0; i < shopSize; i++) {
    // 90% chance de RNG base, 10% de direcionamento
    const isDirected = Math.random() < 0.1;
    
    let pool = allChampions;
    
    if (isDirected && teamTraits.length > 0) {
      // Filtra campeões que possuem pelo menos uma das traits do time
      const directedPool = allChampions.filter(c => 
        (c.origins && c.origins.some((t: string) => teamTraits.includes(t))) ||
        (c.classes && c.classes.some((t: string) => teamTraits.includes(t)))
      );
      
      if (directedPool.length > 0) {
        pool = directedPool;
      }
    }
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    shop.push(pool[randomIndex]);
  }
  
  return shop;
}
