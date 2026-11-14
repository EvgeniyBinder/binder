export type GameCategory = 'slots' | 'live' | 'table'
export type Volatility = 'low' | 'medium' | 'high'

export interface Game {
  id: string
  title: string
  provider: string
  category: GameCategory
  rtp: number
  volatility: Volatility
  minBet: number
  art: string
  featured?: boolean
  rule: { ru: string; en: string }
}

export const games: Game[] = [
  { id: 'neon-fortune', title: 'Neon Fortune', provider: 'Aurum Studio', category: 'slots', rtp: 96.4, volatility: 'high', minBet: 0.2, art: '/games/neon-fortune.webp', featured: true, rule: { ru: 'Пять барабанов, 20 линий выплат. Выигрышные комбинации читаются слева направо. Демонстрационный концепт, не реальная игра.', en: 'Five reels and 20 paylines. Winning combinations read left to right. A demo concept, not a real game.' } },
  { id: 'midnight-roulette', title: 'Midnight Roulette', provider: 'North Live', category: 'live', rtp: 97.3, volatility: 'medium', minBet: 1, art: '/games/midnight-roulette.webp', rule: { ru: 'Европейская рулетка с одним зеро. В демо доступны только правила и параметры, трансляция не подключена.', en: 'European roulette with a single zero. This demo includes rules and parameters only; no stream is connected.' } },
  { id: 'azure-blackjack', title: 'Azure Blackjack', provider: 'North Live', category: 'live', rtp: 99.3, volatility: 'low', minBet: 2, art: '/games/azure-blackjack.webp', rule: { ru: 'Классический blackjack с дилером. Указанный RTP относится к демонстрационным параметрам и базовой стратегии.', en: 'Classic dealer blackjack. The displayed RTP is a demo parameter based on basic strategy.' } },
  { id: 'solar-seven', title: 'Solar Seven', provider: 'PixelForge', category: 'slots', rtp: 95.8, volatility: 'high', minBet: 0.1, art: '/games/solar-seven.webp', rule: { ru: 'Три барабана и пять линий. Все выплаты показаны в демонстрационной таблице правил.', en: 'Three reels and five lines. All payouts are shown in the demo paytable.' } },
  { id: 'wild-current', title: 'Wild Current', provider: 'Aurum Studio', category: 'slots', rtp: 96.1, volatility: 'medium', minBet: 0.2, art: '/games/wild-current.webp', rule: { ru: 'Слот с расширяющимися wild-символами. Бонусная механика не увеличивает сумму возможного проигрыша сверх выбранной ставки.', en: 'A slot with expanding wild symbols. Bonus mechanics cannot increase potential loss beyond the selected stake.' } },
  { id: 'orbit-baccarat', title: 'Orbit Baccarat', provider: 'Orbit Tables', category: 'table', rtp: 98.9, volatility: 'low', minBet: 1, art: '/games/orbit-baccarat.webp', rule: { ru: 'Punto banco с открытой таблицей комиссий. Ставки на игрока, банкира и ничью имеют разный RTP.', en: 'Punto banco with a transparent commission table. Player, banker and tie bets have different RTP values.' } },
  { id: 'crystal-drops', title: 'Crystal Drops', provider: 'PixelForge', category: 'slots', rtp: 96.7, volatility: 'medium', minBet: 0.1, art: '/games/crystal-drops.webp', rule: { ru: 'Каскадные выпадения символов. Каждый раунд независим; прошлые результаты не влияют на следующие.', en: 'Cascading symbol drops. Every round is independent; previous results do not affect the next one.' } },
  { id: 'live-studio', title: 'Live Studio One', provider: 'North Live', category: 'live', rtp: 97.1, volatility: 'medium', minBet: 1, art: '/games/live-studio.webp', featured: true, rule: { ru: 'Концепт live-студии с едиными правилами и историей раундов. Видеопоток и ставки не подключены.', en: 'A live studio concept with unified rules and round history. Video streaming and betting are not connected.' } },
  { id: 'golden-ace', title: 'Golden Ace', provider: 'Orbit Tables', category: 'table', rtp: 98.4, volatility: 'low', minBet: 0.5, art: '/games/golden-ace.webp', rule: { ru: 'Карточная игра с фиксированной таблицей выплат. Перед ставкой доступны все возможные исходы.', en: 'A card game with a fixed paytable. All possible outcomes are available before placing a bet.' } },
  { id: 'temple-spins', title: 'Temple Spins', provider: 'PixelForge', category: 'slots', rtp: 95.5, volatility: 'high', minBet: 0.2, art: '/games/temple-spins.webp', rule: { ru: 'Десять фиксированных линий и бонусные вращения. Автоигра в концепте отключена.', en: 'Ten fixed lines and bonus spins. Autoplay is disabled in this concept.' } },
  { id: 'velocity-live', title: 'Velocity Live', provider: 'North Live', category: 'live', rtp: 96.9, volatility: 'high', minBet: 0.5, art: '/games/velocity-live.webp', rule: { ru: 'Быстрый live-формат с обязательным таймером сессии. Демонстрационный концепт без видео и ставок.', en: 'A fast live format with a mandatory session timer. Demo concept without video or betting.' } },
  { id: 'ember-dice', title: 'Ember Dice', provider: 'Orbit Tables', category: 'table', rtp: 97.6, volatility: 'medium', minBet: 0.5, art: '/games/ember-dice.webp', rule: { ru: 'Игра с двумя кубиками и открытыми вероятностями исходов. Прошлые броски не меняют шансы.', en: 'A two-dice game with disclosed outcome probabilities. Previous rolls do not change the odds.' } },
]

export interface Transaction {
  id: string
  date: string
  type: 'deposit' | 'withdrawal' | 'bet' | 'win'
  amount: number
  status: 'complete' | 'pending' | 'review'
}

export const transactions: Transaction[] = [
  { id: 'TX-2048', date: '2026-11-15T10:24:00', type: 'bet', amount: -18, status: 'complete' },
  { id: 'TX-2047', date: '2026-11-15T10:19:00', type: 'win', amount: 12.5, status: 'complete' },
  { id: 'TX-2046', date: '2026-11-14T18:42:00', type: 'withdrawal', amount: -120, status: 'pending' },
  { id: 'TX-2045', date: '2026-11-14T16:08:00', type: 'deposit', amount: 100, status: 'complete' },
  { id: 'TX-2044', date: '2026-11-12T12:30:00', type: 'withdrawal', amount: -80, status: 'review' },
  { id: 'TX-2043', date: '2026-11-11T09:12:00', type: 'deposit', amount: 150, status: 'complete' },
]

export const chartData = {
  '7': [
    { label: 'Пн', en: 'Mon', value: -12 }, { label: 'Вт', en: 'Tue', value: 18 },
    { label: 'Ср', en: 'Wed', value: -8 }, { label: 'Чт', en: 'Thu', value: 24 },
    { label: 'Пт', en: 'Fri', value: -31 }, { label: 'Сб', en: 'Sat', value: 14 }, { label: 'Вс', en: 'Sun', value: -42.5 },
  ],
  '30': [
    { label: '1 нед.', en: 'Week 1', value: 62 }, { label: '2 нед.', en: 'Week 2', value: -48 },
    { label: '3 нед.', en: 'Week 3', value: 21 }, { label: '4 нед.', en: 'Week 4', value: -77.5 },
  ],
  '90': [
    { label: 'Сен', en: 'Sep', value: 95 }, { label: 'Окт', en: 'Oct', value: -138 }, { label: 'Ноя', en: 'Nov', value: -42.5 },
  ],
}
