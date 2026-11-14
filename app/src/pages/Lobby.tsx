import { ArrowDown, ArrowUpRight, ChevronRight, Clock3, Flame, Gift, Play, ShieldCheck, SlidersHorizontal, Sparkles, Trophy, Users, Zap } from 'lucide-react'
import type { Game, GameCategory, Volatility } from '../data'
import type { TranslationKey } from '../i18n'
import { EmptyState, GameCard } from '../components/Common'

interface LobbyProps {
  games: Game[]
  recommended: Game[]
  featured: Game
  favorites: string[]
  onFavorite: (id: string) => void
  onOpen: (game: Game) => void
  onAccount: () => void
  query: string
  setQuery: (value: string) => void
  category: 'all' | GameCategory
  setCategory: (value: 'all' | GameCategory) => void
  provider: string
  setProvider: (value: string) => void
  volatility: 'all' | Volatility
  setVolatility: (value: 'all' | Volatility) => void
  sort: 'name' | 'rtp'
  setSort: (value: 'name' | 'rtp') => void
  providers: string[]
  onClear: () => void
  sessionSeconds: number
  paused: boolean
  t: (key: TranslationKey) => string
}

export default function Lobby(props: LobbyProps) {
  const { games, recommended, featured, favorites, onFavorite, onOpen, onAccount, query, setQuery, category, setCategory, provider, setProvider, volatility, setVolatility, sort, setSort, providers, onClear, sessionSeconds, paused, t } = props
  const time = `${String(Math.floor(sessionSeconds / 3600)).padStart(2, '0')}:${String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0')}:${String(sessionSeconds % 60).padStart(2, '0')}`
  const scrollCatalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const chooseCategory = (next: 'all' | GameCategory) => { setCategory(next); window.setTimeout(scrollCatalog, 0) }
  const solar = games.find((game) => game.id === 'solar-seven') ?? featured

  return (
    <>
      <section className="lobby-hero">
        <img className="hero-photo" src="/casino-hero.jpg" alt="" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="hero-live"><span />{t('liveNow')}<b>2 418</b>{t('players')}</div>
          <span className="eyebrow">{t('heroEyebrow')}</span>
          <h1>{t('heroTitle').split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{t('heroText')}</p>
          <div className="hero-actions">
            <button type="button" className="button button-primary" onClick={scrollCatalog}>{t('browse')}<Play size={17} fill="currentColor" /></button>
            <button type="button" className="button button-glass" onClick={() => onOpen(featured)} disabled={paused}>{t('rules')}<ArrowUpRight size={18} /></button>
          </div>
          <div className="hero-proof"><span><b>12</b> {t('originalGames')}</span><span><b>99.3%</b> RTP max</span><span><b>24/7</b> {t('demo')}</span></div>
        </div>
        <button type="button" className="hero-showcase" onClick={() => onOpen(featured)} disabled={paused} aria-label={`${t('gameInfo')}: ${featured.title}`}>
          <img src={featured.art} alt="" />
          <span className="showcase-top"><span><Flame size={13} />{t('hot')}</span><span>RTP {featured.rtp}%</span></span>
          <span className="showcase-play"><Play size={24} fill="currentColor" /></span>
          <span className="showcase-label"><small>{t('featured')}</small><strong>{featured.title}</strong><span>{featured.provider}</span></span>
        </button>
        <div className="hero-jackpot"><span><Trophy size={17} />{t('jackpot')}</span><strong>$24 850</strong><small>{t('jackpotText')}</small></div>
      </section>

      <div className="win-ticker" aria-label={t('liveWins')}>
        <span className="ticker-title"><Zap size={15} />{t('liveWins')}</span>
        <div className="ticker-items"><span><b>Neon Fortune</b> · $1 240</span><span><b>Azure Blackjack</b> · $860</span><span><b>Wild Current</b> · $492</span><span><b>Ember Dice</b> · $310</span></div>
        <small>{t('demo')}</small>
      </div>

      <section className="control-strip" aria-label={t('session')}>
        <div className="session-clock"><Clock3 size={20} /><span>{t('session')}<strong>{time}</strong></span></div>
        <div className="session-stat"><span>{t('netResult')}</span><strong className="negative">−$42.50</strong></div>
        <div className="session-limit"><span>35% {t('limitUsed')}</span><div className="limit-track"><span style={{ width: '35%' }} /></div></div>
        <button type="button" className="button button-outline" onClick={onAccount}><ShieldCheck size={18} />{t('myLimits')}</button>
      </section>

      <section className="category-shortcuts" aria-label={t('quickCategories')}>
        <button type="button" onClick={() => chooseCategory('slots')}><span className="shortcut-icon"><Sparkles size={24} /></span><span><strong>{t('slots')}</strong><small>6 {t('results')}</small></span><ChevronRight size={20} /></button>
        <button type="button" onClick={() => chooseCategory('live')}><span className="shortcut-icon live"><Users size={24} /></span><span><strong>{t('live')}</strong><small>4 {t('results')}</small></span><ChevronRight size={20} /></button>
        <button type="button" onClick={() => chooseCategory('table')}><span className="shortcut-icon gold"><Trophy size={24} /></span><span><strong>{t('table')}</strong><small>3 {t('results')}</small></span><ChevronRight size={20} /></button>
      </section>

      <section className="content-section recommendations">
        <div className="section-heading">
          <div><span className="section-icon"><Flame size={20} /></span><h2>{t('recommended')}</h2></div>
          <button type="button" className="section-link" onClick={scrollCatalog}>{t('viewAll')}<ArrowDown size={16} /></button>
        </div>
        <div className="game-grid recommendation-grid">
          {recommended.map((game) => <GameCard key={game.id} game={game} favorite={favorites.includes(game.id)} onFavorite={() => onFavorite(game.id)} onOpen={() => onOpen(game)} t={t} paused={paused} />)}
        </div>
      </section>

      <section className="engagement-grid">
        <div className="promo-banner">
          <img src={solar.art} alt="" />
          <div className="promo-copy"><span className="eyebrow"><Gift size={15} />{t('promoEyebrow')}</span><h2>{t('promoTitle')}</h2><p>{t('promoText')}</p><button type="button" className="button button-dark" onClick={onAccount}>{t('promoCta')}<ArrowUpRight size={17} /></button></div>
        </div>
        <div className="mission-panel">
          <div className="mission-heading"><span><Trophy size={20} />{t('mission')}</span><small>01 / 03</small></div>
          <h3>{t('missionText')}</h3>
          <div className="mission-progress"><span /></div>
          <p>{t('missionProgress')}</p>
          <button type="button" className="button button-outline" onClick={scrollCatalog}>{t('missionCta')}<ChevronRight size={17} /></button>
        </div>
      </section>

      <section className="content-section" id="catalog">
        <div className="section-heading">
          <div><span className="section-icon"><Sparkles size={20} /></span><h2>{t('allGames')}</h2></div>
          <p>{t('catalogText')}</p>
        </div>
        <div className="provider-pills" aria-label={t('provider')}>
          <button type="button" className={provider === 'all' ? 'active' : ''} onClick={() => setProvider('all')}>{t('allProviders')}</button>
          {providers.map((item) => <button type="button" key={item} className={provider === item ? 'active' : ''} onClick={() => setProvider(item)}>{item}</button>)}
        </div>
        <div className="catalog-tools">
          <div className="category-tabs" role="tablist" aria-label={t('allGames')}>
            {(['all', 'slots', 'live', 'table'] as const).map((item) => (
              <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{t(item)}</button>
            ))}
          </div>
          <label className="mobile-search"><span className="sr-only">{t('search')}</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchHint')} /></label>
          <div className="filter-row">
            <label><span>{t('provider')}</span><select value={provider} onChange={(e) => setProvider(e.target.value)}><option value="all">{t('allProviders')}</option>{providers.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>{t('volatility')}</span><select value={volatility} onChange={(e) => setVolatility(e.target.value as 'all' | Volatility)}><option value="all">{t('allVolatility')}</option><option value="low">{t('low')}</option><option value="medium">{t('medium')}</option><option value="high">{t('high')}</option></select></label>
            <label><span>{t('sort')}</span><select value={sort} onChange={(e) => setSort(e.target.value as 'name' | 'rtp')}><option value="name">{t('byName')}</option><option value="rtp">{t('byRtp')}</option></select></label>
            <button type="button" className="button button-outline clear-button" onClick={onClear}><SlidersHorizontal size={17} />{t('clear')}</button>
          </div>
        </div>
        <div className="results-count"><strong>{games.length}</strong> {t('results')}</div>
        {games.length ? (
          <div className="game-grid catalog-grid">
            {games.map((game) => <GameCard key={game.id} game={game} favorite={favorites.includes(game.id)} onFavorite={() => onFavorite(game.id)} onOpen={() => onOpen(game)} t={t} paused={paused} />)}
          </div>
        ) : <EmptyState title={t('noResults')} text={t('noResultsText')} action={t('clear')} onAction={onClear} />}
      </section>
    </>
  )
}
