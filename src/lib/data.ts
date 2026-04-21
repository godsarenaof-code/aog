import { Sword, Shield, Zap, Sparkles, Target, Flame, Box, ZapOff, ShieldAlert, Cpu, Wind, Search } from "lucide-react";

export interface Champion {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  origins: string[];
  classes: string[];
  ability: { name: string; mana: number; effect: string };
  desc: string;
}

export const champions: Champion[] = [
  // Tier 1
  { id: "kael", name: "Kael", tier: 1, origins: ["Ciborgue"], classes: ["Lâmina"], ability: { name: "Corte Biônico", mana: 60, effect: "Causa 200% de dano físico e aplica sangramento por 3s." }, desc: "Lâmina ciborgue que abre o early game com pressão constante." },
  { id: "m1ra", name: "M1-RA", tier: 1, origins: ["Holográfico"], classes: ["Atirador"], ability: { name: "Disparo Espelhado", mana: 50, effect: "O próximo tiro ricocheteia em 2 inimigos próximos." }, desc: "Principal fonte de dano à distância na fase inicial." },
  { id: "tork", name: "Tork", tier: 1, origins: ["Ciborgue"], classes: ["Sentinela"], ability: { name: "Protocolo Escudo", mana: 70, effect: "Ganha um escudo de 300 HP e atordoa o alvo atual por 1s." }, desc: "Tanque padrão para segurar a linha de frente." },
  { id: "nyx", name: "Nyx", tier: 1, origins: ["Sindicato"], classes: ["Lâmina"], ability: { name: "Golpe de Sorte", mana: 65, effect: "Salta no inimigo com menos vida e causa dano crítico garantido." }, desc: "Assassina do submundo que executa alvos enfraquecidos." },
  { id: "pax", name: "Pax", tier: 1, origins: ["Ascendente"], classes: ["Bastion"], ability: { name: "Meditação Atômica", mana: 80, effect: "Cura 15% da vida máxima e ganha 20 de Armadura (acumulativo)." }, desc: "Monge ascendente que escala defensivamente a cada uso." },
  // Tier 2
  { id: "volt", name: "Volt", tier: 2, origins: ["Ciborgue"], classes: ["Tecnomago"], ability: { name: "Corrente Curta", mana: 60, effect: "Dispara um raio que reduz a mana do alvo em 20 e causa dano mágico." }, desc: "Anti-mago: silencia conjuradores enquanto causa dano." },
  { id: "sombra", name: "Sombra", tier: 2, origins: ["Holográfico"], classes: ["Lâmina"], ability: { name: "Fase de Luz", mana: 75, effect: "Torna-se invisível por 2s e reaparece atrás do inimigo mais distante." }, desc: "Assassina holográfica especialista em alcançar carregadores." },
  { id: "barao", name: "Barão Grivas", tier: 2, origins: ["Sindicato"], classes: ["Sentinela", "Bastion"], ability: { name: "Impacto de Prestígio", mana: 85, effect: "Bate o cajado no chão, reduzindo a Vel. de Atk dos inimigos ao redor." }, desc: "Chefe do Sindicato — controla o ritmo da linha de frente." },
  { id: "lyra", name: "Lyra", tier: 2, origins: ["Ascendente"], classes: ["Atirador"], ability: { name: "Flecha de Fóton", mana: 70, effect: "Atira um feixe que atravessa o mapa, causando dano a todos no caminho." }, desc: "Sniper ascendente perfeita para inimigos enfileirados." },
  { id: "nanobit", name: "Nano-Bit", tier: 2, origins: [], classes: ["Tecnomago", "Sentinela"], ability: { name: "Reparo Nanométrico", mana: 70, effect: "Libera enxame de nanobots que cura o aliado mais ferido em 250 HP." }, desc: "Suporte técnico — ponte entre Tecnomagos e a linha de frente." },
  // Tier 3
  { id: "astra", name: "Astra", tier: 3, origins: ["Holográfico"], classes: ["Tecnomago"], ability: { name: "Nebulosa Digital", mana: 90, effect: "Cria uma área de dano contínuo e gera 1 clone para cada inimigo morto ali." }, desc: "Conjuradora de área que escala com kills consecutivas." },
  { id: "vector", name: "Vector", tier: 3, origins: ["Ciborgue"], classes: ["Atirador"], ability: { name: "Modo Artilharia", mana: 80, effect: "Fica imóvel e ganha +100% de Vel. de Atk por 5 segundos." }, desc: "Torre de fogo cibernética para sustained damage." },
  { id: "titan", name: "Titan", tier: 3, origins: [], classes: ["Sentinela", "Bastion"], ability: { name: "Cúpula Alpha", mana: 100, effect: "Cria uma barreira que bloqueia todos os projéteis inimigos por 3s." }, desc: "Anti-atiradores definitivo. Domina rounds com burst à distância." },
  { id: "zane", name: "Zane", tier: 3, origins: ["Ciborgue", "Sindicato"], classes: ["Lâmina"], ability: { name: "Turbilhão de Créditos", mana: 75, effect: "Gira as lâminas; se matar alguém, gera 1 ouro (máx. 2 por round)." }, desc: "A unidade mais disputada — economia + combate em um pacote." },
  { id: "cybermonk", name: "Cyber-Monk", tier: 3, origins: ["Ascendente"], classes: ["Bastion"], ability: { name: "Palma de Plasma", mana: 85, effect: "Empurra o alvo para o final do grid e o atordoa por 2.5s." }, desc: "Disruptor de posicionamento — reorganiza qualquer comp inimiga." },
  // Tier 4
  { id: "nova", name: "Nova", tier: 4, origins: ["Ascendente"], classes: ["Tecnomago"], ability: { name: "Colapso Estelar", mana: 120, effect: "Invoca um meteoro com dano massivo em área e queima 50% da mana dos atingidos." }, desc: "Wipe mágico que silencia conjuradores inimigos no impacto." },
  { id: "helius", name: "Helius", tier: 4, origins: ["Ciborgue"], classes: ["Sentinela"], ability: { name: "Núcleo de Fusão", mana: 110, effect: "Explode em energia, curando aliados e causando dano (baseado na vida máx dele)." }, desc: "Tank-suporte híbrido — quanto mais HP, mais devastador." },
  { id: "luna", name: "Luna", tier: 4, origins: ["Holográfico"], classes: ["Atirador", "Tecnomago"], ability: { name: "Lua Binária", mana: 90, effect: "Alterna tiros físicos (azul) e mágicos (roxo), ignorando 40% das resistências." }, desc: "Carregadora flexível — escala com itens AD ou AP." },
  { id: "dravenx", name: "Draven-X", tier: 4, origins: ["Sindicato"], classes: ["Lâmina"], ability: { name: "Lâmina de Retorno", mana: 80, effect: "Lança um disco com dano na ida e volta. Dano aumenta a cada retorno pego." }, desc: "Alto risco, alta recompensa do Sindicato." },
  // Tier 5
  { id: "zeus01", name: "Zeus-01", tier: 5, origins: ["Deidade"], classes: ["Tecnomago"], ability: { name: "Julgamento Binário", mana: 150, effect: "Relâmpagos caem em todos os inimigos. Inimigos acima de 80% de HP são atordoados." }, desc: "IA divina de controle global — pune comps de tank stacking." },
  { id: "ares", name: "Ares", tier: 5, origins: ["Deidade"], classes: ["Lâmina", "Bastion"], ability: { name: "Ira de Marte", mana: 130, effect: "Entra em frenesi: 100% de roubo de vida e ataques causam dano em área." }, desc: "Um exército de um homem só. Impossível de ignorar." },
  { id: "gaia", name: "Gaia", tier: 5, origins: ["Deidade"], classes: ["Sentinela"], ability: { name: "Reforma da Terra", mana: 140, effect: "Transforma o chão em nanobots que regeneram 100% da vida de um aliado por segundo." }, desc: "Cura divina — mantém o carry vivo contra qualquer burst." },
];

export const origins = [
  { name: "Holográfico", levels: "2 / 4", desc: "(2) Cria clone com 30% HP. (4) Clone causa 60% de dano.", icon: "👤" },
  { name: "Ciborgue", levels: "2 / 4 / 6", desc: "Ganham 200/400/700 de Escudo de Energia e 15% de Dano de Ataque.", icon: "⚙️" },
  { name: "Ascendente", levels: "3 / 5", desc: "A cada 2s, ganham +5% de dano (acumula até o fim da rodada).", icon: "✨" },
  { name: "Sindicato", levels: "2", desc: "Vencer = +1 Ouro. Perder = próximo Roll custa 1.", icon: "💰" },
  { name: "Deidade", levels: "1", desc: "+15% de status para cada Elo acima de Mortal.", icon: "⚡" },
];

export const classes = [
  { name: "Lâmina", levels: "2 / 4 / 6", desc: "(2) 15% chance de ataque duplo. (4) 30%. (6) 50% + Crítico.", icon: Sword },
  { name: "Sentinela", levels: "2 / 4", desc: "(2) +40 Armadura. (4) Aliados adjacentes ganham 50% dessa armadura.", icon: Shield },
  { name: "Tecnomago", levels: "2 / 4", desc: "(2) +20% Poder de Magia. (4) Curam 15% do dano causado por magias.", icon: Sparkles },
  { name: "Atirador", levels: "2 / 4", desc: "(2) +1 de Range. (4) Cada ataque aumenta Vel. Atk em 5%.", icon: Target },
  { name: "Bastion", levels: "2 / 3", desc: "(2) 20% de Redução de Dano. (3) 40%.", icon: Flame },
];

export interface Item {
  id: string;
  name: string;
  type: "base" | "combined" | "special";
  desc: string;
  recipe?: [string, string];
  icon?: string;
}

export const baseItems: Item[] = [
  { id: "lamina_base", name: "Lâmina de Plasma", type: "base", desc: "+15 Dano de Ataque.", icon: "⚔️" },
  { id: "placa_base", name: "Placa de Titânio", type: "base", desc: "+20 Armadura.", icon: "🛡️" },
  { id: "chip_base", name: "Chip de Precisão", type: "base", desc: "+15% Velocidade de Ataque.", icon: "🏹" },
  { id: "cristal_base", name: "Cristal de Éter", type: "base", desc: "+20 Poder de Habilidade.", icon: "🔮" },
  { id: "capa_base", name: "Capa de Refração", type: "base", desc: "+20 Resistência Mágica.", icon: "🧥" },
  { id: "bota_base", name: "Bota de Impulso", type: "base", desc: "+10% Esquiva / +15 Mana Inicial.", icon: "👢" },
];

export const combinedItems: Item[] = [
  { id: "lamina_suprema", name: "Lâmina Suprema", type: "combined", recipe: ["lamina_base", "lamina_base"], desc: "+40 ATK. Ataques causam 5% da vida máx do alvo como dano real.", icon: "⚔️⚔️" },
  { id: "muralha_ferro", name: "Muralha de Ferro", type: "combined", recipe: ["placa_base", "placa_base"], desc: "+50 ARM. Reflete 20% do dano físico recebido como dano mágico.", icon: "🛡️🛡️" },
  { id: "hyper_link", name: "Hyper-Link", type: "combined", recipe: ["chip_base", "chip_base"], desc: "+40% Vel. ATK. Cada 3º ataque causa um choque em área.", icon: "🏹🏹" },
  { id: "nucleo_arcano", name: "Núcleo Arcano", type: "combined", recipe: ["cristal_base", "cristal_base"], desc: "+40 AP. Recupera 25% da mana total após cada conjuração.", icon: "🔮🔮" },
  { id: "manto_nevoa", name: "Manto da Névoa", type: "combined", recipe: ["capa_base", "capa_base"], desc: "+50 RM. Cura o portador em 2% da vida máx por segundo.", icon: "🧥🧥" },
  { id: "passo_quantico", name: "Passo Quântico", type: "combined", recipe: ["bota_base", "bota_base"], desc: "+30 Mana Inicial. No início da luta, teleporta para o tile mais seguro.", icon: "👢👢" },
  { id: "furia_rapida", name: "Fúria Rápida", type: "combined", recipe: ["lamina_base", "chip_base"], desc: "Ataques acumulam 6% de Vel. ATK (infinito na rodada).", icon: "⚔️🏹" },
  { id: "gume_executor", name: "Gume do Executor", type: "combined", recipe: ["lamina_base", "placa_base"], desc: "Concede 25% de Roubo de Vida Físico.", icon: "⚔️🛡️" },
  { id: "coracao_sombrio", name: "Coração Sombrio", type: "combined", recipe: ["lamina_base", "cristal_base"], desc: "Concede 25% de Vampirismo Universal.", icon: "⚔️🔮" },
  { id: "quebra_sistemas", name: "Quebra-Sistemas", type: "combined", recipe: ["lamina_base", "capa_base"], desc: "Ataques reduzem a Armadura do alvo em 40% por 5 segundos.", icon: "⚔️🧥" },
  { id: "lamina_impulso", name: "Lâmina de Impulso", type: "combined", recipe: ["lamina_base", "bota_base"], desc: "Salta no alvo mais distante e ganha +50% Crit.", icon: "⚔️👢" },
  { id: "armadura_espinhosa", name: "Armadura Espinhosa", type: "combined", recipe: ["placa_base", "chip_base"], desc: "Ganha 10 de Armadura para cada inimigo que estiver te atacando.", icon: "🛡️🏹" },
  { id: "placa_nanobots", name: "Placa de Nanobots", type: "combined", recipe: ["placa_base", "cristal_base"], desc: "Ao usar a habilidade, ganha um escudo de 400 HP por 4s.", icon: "🛡️🔮" },
  { id: "muralha_arcana", name: "Muralha Arcana", type: "combined", recipe: ["placa_base", "capa_base"], desc: "Reduz em 30% todo dano recebido de habilidades.", icon: "🛡️🧥" },
  { id: "estabilizador", name: "Estabilizador", type: "combined", recipe: ["placa_base", "bota_base"], desc: "Torna o portador imune a atordoamento e controles de grupo.", icon: "🛡️👢" },
  { id: "arco_fotons", name: "Arco de Fótons", type: "combined", recipe: ["chip_base", "cristal_base"], desc: "Ataques básicos causam 40 de dano mágico adicional.", icon: "🏹🔮" },
  { id: "manto_vidro", name: "Manto de Vidro", type: "combined", recipe: ["chip_base", "capa_base"], desc: "Ao sofrer dano, ganha +20% de Esquiva por 3 segundos.", icon: "🏹🧥" },
  { id: "radar_ativo", name: "Radar Ativo", type: "combined", recipe: ["chip_base", "bota_base"], desc: "Aumenta o alcance de ataque (Range) em +2 Tiles.", icon: "🏹👢" },
  { id: "capa_antimateria", name: "Capa de Antimatéria", type: "combined", recipe: ["cristal_base", "capa_base"], desc: "Habilidades reduzem a Resistência Mágica do inimigo em 40%.", icon: "🔮🧥" },
  { id: "sobrecarga", name: "Sobrecarga", type: "combined", recipe: ["cristal_base", "bota_base"], desc: "A primeira habilidade da luta causa 50% de dano adicional.", icon: "🔮👢" },
  { id: "filtro_energia", name: "Filtro de Energia", type: "combined", recipe: ["capa_base", "bota_base"], desc: "Ganha 15 de mana toda vez que esquiver de um ataque.", icon: "🧥👢" },
];

export const specialItems: Item[] = [
  { 
    id: "essencia_divina", 
    name: "Essência Divina", 
    type: "special", 
    desc: "Ao ser equipada em um campeão com um Item Completo, o transforma em Divino (status 2x + Aura de 15%).",
    icon: "✨" 
  },
];
