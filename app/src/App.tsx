import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Check, ChevronRight, CirclePause, Heart, LayoutGrid, MessageSquareText, ReceiptText, Search, ShieldCheck, UserRound } from 'lucide-react'
import Lobby from './pages/Lobby'
import type { Limits } from './pages/Account'
import type { Ticket } from './pages/Support'
import { EmptyState, GameCard, IconButton, Modal } from './components/Common'
import { games, type Game, type GameCategory, type Volatility } from './data'
import { en, ru, type TranslationKey } from './i18n'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

const Account = lazy(() => import('./pages/Account'))
const Activity = lazy(() => import('./pages/Activity'))
const Support = lazy(() => import('./pages/Support'))

type View = 'lobby' | 'favorites' | 'account' | 'activity' | 'support'
type Lang = 'ru' | 'en'

export default function App() {
  const [lang, setLang] = useLocalStorage<Lang>('aurum-lang', 'ru')
  const t = useCallback((key: TranslationKey) => (lang === 'ru' ? ru : en)[key], [lang])
  const [view, setView] = useState<View>('lobby')
  const [favorites, setFavorites] = useLocalStorage<string[]>('aurum-favorites', ['neon-fortune', 'wild-current'])
  const [limits, setLimits] = useLocalStorage<Limits>('aurum-limits', { deposit: 500, loss: 250, bet: 10, session: 30 })
  const [bonusActive, setBonusActive] = useLocalStorage('aurum-bonus', true)
  const [pauseUntil, setPauseUntil] = useLocalStorage('aurum-pause', '')
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('aurum-tickets', [])
  const [readNotifications, setReadNotifications] = useLocalStorage<string[]>('aurum-read-notifications', [])
  const [notificationSettings, setNotificationSettings] = useLocalStorage('aurum-notification-settings', { session: true, payments: true, verification: true, marketing: false })

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | GameCategory>('all')
  const [provider, setProvider] = useState('all')
  const [volatility, setVolatility] = useState<'all' | Volatility>('all')
  const [sort, setSort] = useState<'name' | 'rtp'>('name')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPause, setShowPause] = useState(false)
  const [pausePeriod, setPausePeriod] = useState('1')
  const [showBonusConfirm, setShowBonusConfirm] = useState(false)
  const [toast, setToast] = useState('')
  const [sessionSeconds, setSessionSeconds] = useState(24 * 60 + 18)
  const searchRef = useRef<HTMLInputElement>(null)

  const paused = Boolean(pauseUntil && new Date(pauseUntil).getTime() > Date.now())
  const providers = useMemo(() => Array.from(new Set(games.map((game) => game.provider))).sort(), [])
  const featured = games.find((game) => game.featured) ?? games[0]

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => {
    const timer = window.setInterval(() => setSessionSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault(); setView('lobby'); window.setTimeout(() => searchRef.current?.focus(), 0)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % (limits.session * 60) === 0) setToast(t('sessionNotice'))
  }, [sessionSeconds, limits.session, t])

  const navigate = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const clearFilters = () => { setQuery(''); setCategory('all'); setProvider('all'); setVolatility('all'); setSort('name') }
  const openGame = (game: Game) => { if (!paused) setSelectedGame(game) }

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return games.filter((game) => {
      const matchesQuery = !normalized || `${game.title} ${game.provider}`.toLowerCase().includes(normalized)
      return matchesQuery && (category === 'all' || game.category === category) && (provider === 'all' || game.provider === provider) && (volatility === 'all' || game.volatility === volatility)
    }).sort((a, b) => sort === 'rtp' ? b.rtp - a.rtp : a.title.localeCompare(b.title))
  }, [query, category, provider, volatility, sort])

  const recommended = useMemo(() => {
    const favoriteGames = games.filter((game) => favorites.includes(game.id))
    return [...games].sort((a, b) => {
      const score = (game: Game) => (favorites.includes(game.id) ? 3 : 0) + (favoriteGames.some((item) => item.provider === game.provider) ? 2 : 0) + (favoriteGames.some((item) => item.category === game.category) ? 1 : 0) + (game.featured ? 0.5 : 0)
      return score(b) - score(a) || b.rtp - a.rtp
    }).slice(0, 4)
  }, [favorites])

  const favoriteGames = games.filter((game) => favorites.includes(game.id))
  const notifications = [
    { id: 'session', text: t('sessionNotice'), time: t('now'), target: 'account' as View },
    { id: 'payment', text: t('withdrawalNotice'), time: t('yesterday'), target: 'activity' as View },
    { id: 'verification', text: t('verificationNotice2'), time: t('yesterday'), target: 'account' as View },
  ]
  const unread = notifications.filter((item) => !readNotifications.includes(item.id)).length
  const navItems: { id: View; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'lobby', label: t('lobby'), icon: LayoutGrid }, { id: 'favorites', label: t('favorites'), icon: Heart },
    { id: 'account', label: t('account'), icon: UserRound }, { id: 'activity', label: t('activity'), icon: ReceiptText },
    { id: 'support', label: t('support'), icon: MessageSquareText },
  ]
  const confirmPause = () => {
    const days = pausePeriod === '180' ? 180 : Number(pausePeriod)
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    setPauseUntil(until); setShowPause(false); setSelectedGame(null); setToast(t('pauseSet')); navigate('account')
  }
  const updateNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((current) => ({ ...current, [key]: !current[key] }))
    setToast(t('saved'))
  }

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <button type="button" className="brand" onClick={() => navigate('lobby')} aria-label="Aurum home"><span className="brand-mark" /><span>AURUM<small>PRIVATE CLUB</small></span></button>
        <nav aria-label={t('menu')}>{navItems.map((item) => <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={19} /><span>{item.label}</span>{item.id === 'favorites' && favorites.length > 0 && <small>{favorites.length}</small>}</button>)}</nav>
        <div className="side-responsible"><ShieldCheck size={22} /><strong>{t('responsible')}</strong><p>{t('pauseText')}</p><button type="button" className="button button-outline" onClick={() => setShowPause(true)} disabled={paused}>{paused ? t('pausedShort') : t('pausePlay')}</button></div>
        <div className="side-footer"><span>18+</span><p>{t('providerApi')}</p></div>
      </aside>

      <div className="main-shell">
        <header className="top-bar">
          <div className="mobile-brand"><span className="brand-mark" /><strong>AURUM</strong><span>{t('demo')}</span></div>
          <label className="global-search"><Search size={18} /><input ref={searchRef} value={query} onFocus={() => { if (view !== 'lobby') setView('lobby') }} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchHint')} aria-label={t('search')} /><kbd>/</kbd></label>
          <div className="top-actions">
            <span className="demo-indicator"><i />{t('demoNotice')}</span>
            <button type="button" className="demo-balance" onClick={() => navigate('account')}><span>{t('demoBalance')}</span><strong>$248.50</strong></button>
            <button type="button" className="language-button" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>{t('language')}</button>
            <div className="notification-button"><IconButton label={t('notifications')} onClick={() => setShowNotifications(true)}><Bell size={20} /></IconButton>{unread > 0 && <span>{unread}</span>}</div>
            <IconButton label={t('profile')} onClick={() => navigate('account')}><UserRound size={20} /></IconButton>
          </div>
        </header>

        <main>
          <Suspense fallback={<div className="page-loading" role="status">AURUM / {t('demo')}</div>}>
          {view === 'lobby' && <Lobby games={filteredGames} recommended={recommended} featured={featured} favorites={favorites} onFavorite={toggleFavorite} onOpen={openGame} onAccount={() => navigate('account')} query={query} setQuery={setQuery} category={category} setCategory={setCategory} provider={provider} setProvider={setProvider} volatility={volatility} setVolatility={setVolatility} sort={sort} setSort={setSort} providers={providers} onClear={clearFilters} sessionSeconds={sessionSeconds} paused={paused} t={t} />}
          {view === 'favorites' && <div className="page-stack"><header className="page-header"><div><span className="eyebrow">{favorites.length} {t('results')}</span><h1>{t('favoritesTitle')}</h1><p>{t('recommendedText')}</p></div><Heart size={42} strokeWidth={1.2} /></header>{favoriteGames.length ? <div className="game-grid catalog-grid">{favoriteGames.map((game) => <GameCard key={game.id} game={game} favorite onFavorite={() => toggleFavorite(game.id)} onOpen={() => openGame(game)} t={t} paused={paused} />)}</div> : <EmptyState title={t('favoritesEmpty')} text={t('favoritesEmptyText')} action={t('toCatalog')} onAction={() => navigate('lobby')} />}</div>}
          {view === 'account' && <Account t={t} lang={lang} limits={limits} onSaveLimits={setLimits} onPause={() => setShowPause(true)} paused={paused} pauseUntil={pauseUntil} onReset={() => { setPauseUntil(''); setToast(t('resetDemo')) }} bonusActive={bonusActive} onBonus={() => setShowBonusConfirm(true)} onToast={setToast} />}
          {view === 'activity' && <Activity t={t} lang={lang} onToast={setToast} />}
          {view === 'support' && <Support t={t} lang={lang} tickets={tickets} onTickets={setTickets} onToast={setToast} />}
          </Suspense>
        </main>

        <footer className="app-footer"><span>AURUM © 2026</span><p>{t('footerText')}</p><button type="button" onClick={() => navigate('support')}>{t('responsible')}<ChevronRight size={15} /></button></footer>
      </div>

      <nav className="bottom-nav" aria-label={t('menu')}>{navItems.map((item) => <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={20} /><span>{item.label}</span></button>)}</nav>

      {selectedGame && <Modal title={selectedGame.title} onClose={() => setSelectedGame(null)} wide><div className="game-modal-layout"><img src={selectedGame.art} alt="" className="game-modal-art" /><div className="game-modal-copy"><span className="eyebrow">{selectedGame.provider} · {t(selectedGame.category)}</span><div className="game-parameters"><div><span>RTP</span><strong>{selectedGame.rtp}%</strong></div><div><span>{t('volatility')}</span><strong>{t(selectedGame.volatility)}</strong></div><div><span>{t('minBet')}</span><strong>${selectedGame.minBet.toFixed(2)}</strong></div></div><h3>{t('gameRules')}</h3><p>{selectedGame.rule[lang]}</p><div className="integration-note"><ShieldCheck size={20} /><span>{t('noGame')}</span></div><button type="button" className="button button-primary" onClick={() => toggleFavorite(selectedGame.id)}><Heart size={18} fill={favorites.includes(selectedGame.id) ? 'currentColor' : 'none'} />{favorites.includes(selectedGame.id) ? t('removeFavorite') : t('addFavorite')}</button></div></div></Modal>}

      {showPause && <Modal title={t('pauseTitle')} onClose={() => setShowPause(false)}><p className="modal-description">{t('pauseDescription')}</p><div className="pause-options">{(['1', '7', '30', '180'] as const).map((item) => <button key={item} type="button" className={pausePeriod === item ? 'selected' : ''} onClick={() => setPausePeriod(item)}>{item === '1' ? t('pause24') : item === '7' ? t('pause7') : item === '30' ? t('pause30') : t('selfExclude')}</button>)}</div><div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setShowPause(false)}>{t('cancel')}</button><button type="button" className="button button-primary" onClick={confirmPause}><CirclePause size={18} />{t('confirmPause')}</button></div></Modal>}

      {showBonusConfirm && <Modal title={t('confirmBonus')} onClose={() => setShowBonusConfirm(false)}><p className="modal-description">{t('confirmBonusText')}</p><div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setShowBonusConfirm(false)}>{t('cancel')}</button><button type="button" className="button button-primary" onClick={() => { setBonusActive(false); setShowBonusConfirm(false); setToast(t('bonusOff')) }}>{t('confirm')}</button></div></Modal>}

      {showNotifications && <Modal title={t('notificationsTitle')} onClose={() => setShowNotifications(false)}><div className="notification-list">{notifications.map((item) => <button key={item.id} type="button" className={readNotifications.includes(item.id) ? 'read' : ''} onClick={() => { setReadNotifications((current) => current.includes(item.id) ? current : [...current, item.id]); setShowNotifications(false); navigate(item.target) }}><span>{item.text}</span><small>{item.time}</small></button>)}</div><button type="button" className="button button-text" onClick={() => setReadNotifications(notifications.map((item) => item.id))}><Check size={17} />{t('markRead')}</button><div className="notification-settings"><h3>{t('notificationSettings')}</h3>{([{ key: 'session', label: t('sessionNotices') }, { key: 'payments', label: t('paymentNotices') }, { key: 'verification', label: t('verificationNotices') }, { key: 'marketing', label: t('marketingNotices') }] as const).map((item) => <label key={item.key}><span>{item.label}</span><input type="checkbox" checked={notificationSettings[item.key]} onChange={() => updateNotification(item.key)} /><i aria-hidden="true" /></label>)}</div></Modal>}

      {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
    </div>
  )
}
