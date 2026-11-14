import { useEffect, type ReactNode } from 'react'
import { Heart, Play, X } from 'lucide-react'
import type { Game } from '../data'
import type { TranslationKey } from '../i18n'

export function IconButton({ label, children, onClick, active = false, disabled = false, className = '' }: {
  label: string
  children: ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className={`icon-button ${active ? 'is-active' : ''} ${className}`}>
      {children}
    </button>
  )
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className={`modal-panel ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <h2>{title}</h2>
          <IconButton label="Close" onClick={onClose}><X size={20} /></IconButton>
        </div>
        {children}
      </section>
    </div>
  )
}

export function GameCard({ game, favorite, onFavorite, onOpen, t, paused }: {
  game: Game
  favorite: boolean
  onFavorite: () => void
  onOpen: () => void
  t: (key: TranslationKey) => string
  paused: boolean
}) {
  return (
    <article className="game-card">
      <div className="game-art-wrap">
        <button type="button" className="game-art-button" onClick={onOpen} disabled={paused} aria-label={`${t('gameInfo')}: ${game.title}`}>
          <img src={game.art} alt="" className="game-art" loading="lazy" />
          <span className="game-open"><Play size={22} fill="currentColor" /></span>
        </button>
        <span className="game-category">{game.category === 'live' ? 'LIVE' : game.category === 'slots' ? 'SLOT' : 'TABLE'}</span>
        <IconButton label={favorite ? t('removeFavorite') : t('addFavorite')} onClick={onFavorite} active={favorite} className="favorite-button">
          <Heart size={19} fill={favorite ? 'currentColor' : 'none'} />
        </IconButton>
      </div>
      <button type="button" className="game-copy" onClick={onOpen} disabled={paused}>
        <span className="game-provider">{game.provider}</span>
        <strong>{game.title}</strong>
        <span className="game-meta">RTP {game.rtp.toFixed(1)}% <span>·</span> {t(game.volatility)}</span>
      </button>
    </article>
  )
}

export function EmptyState({ title, text, action, onAction }: { title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">∅</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button type="button" className="button button-outline" onClick={onAction}>{action}</button>
    </div>
  )
}
