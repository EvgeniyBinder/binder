import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownLeft, ArrowUpRight, BadgeCheck, CirclePause, FileCheck2, WalletCards } from 'lucide-react'
import { chartData } from '../data'
import type { TranslationKey } from '../i18n'

export interface Limits { deposit: number; loss: number; bet: number; session: number }

interface AccountProps {
  t: (key: TranslationKey) => string
  lang: 'ru' | 'en'
  limits: Limits
  onSaveLimits: (limits: Limits) => void
  onPause: () => void
  paused: boolean
  pauseUntil: string
  onReset: () => void
  bonusActive: boolean
  onBonus: () => void
  onToast: (message: string) => void
}

export default function Account({ t, lang, limits, onSaveLimits, onPause, paused, pauseUntil, onReset, bonusActive, onBonus, onToast }: AccountProps) {
  const [period, setPeriod] = useState<'7' | '30' | '90'>('7')
  const [draft, setDraft] = useState(limits)
  useEffect(() => setDraft(limits), [limits])
  const data = chartData[period]
  const save = () => {
    if (Object.values(draft).some((value) => !Number.isFinite(value) || value <= 0)) {
      onToast(t('invalidLimits'))
      return
    }
    onSaveLimits(draft)
    onToast(t('limitsSaved'))
  }

  return (
    <div className="page-stack account-page">
      <header className="page-header">
        <div><span className="eyebrow">{t('demoProfile')} · A-1024</span><h1>{t('accountTitle')}</h1><p>{t('accountText')}</p></div>
        <div className="profile-stamp"><span>AK</span><div><strong>Alex Kim</strong><small>{t('verified')}</small></div><BadgeCheck size={22} /></div>
      </header>

      {paused && <section className="pause-banner"><CirclePause size={25} /><div><strong>{t('pauseActive')}</strong><p>{t('pauseUntil')} {new Date(pauseUntil).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB')}</p></div><button type="button" className="button button-outline" onClick={onReset}>{t('resetDemo')}</button></section>}

      <section className="finance-layout">
        <div className="net-result-block">
          <span>{t('netResult')} · {t('period30')}</span>
          <strong>−$42.50</strong>
          <p>{lang === 'ru' ? 'Выигрыши − ставки' : 'Wins − bets'}</p>
        </div>
        <div className="finance-stats">
          <div><ArrowDownLeft size={20} /><span>{t('deposits')}</span><strong>$250.00</strong></div>
          <div><ArrowUpRight size={20} /><span>{t('bets')}</span><strong>$418.00</strong></div>
          <div><WalletCards size={20} /><span>{t('wins')}</span><strong>$375.50</strong></div>
        </div>
      </section>

      <section className="chart-section">
        <div className="section-heading compact"><div><span className="section-index">01</span><h2>{t('resultDynamics')}</h2></div><div className="small-tabs">{(['7', '30', '90'] as const).map((item) => <button key={item} type="button" className={period === item ? 'selected' : ''} onClick={() => setPeriod(item)}>{t(`period${item}` as TranslationKey)}</button>)}</div></div>
        <div className="chart-wrap" aria-label={t('resultDynamics')}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#292d31" vertical={false} />
              <XAxis dataKey={lang === 'ru' ? 'label' : 'en'} stroke="#8c9399" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#8c9399" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${value}`} />
              <ReferenceLine y={0} stroke="#737a80" />
              <Tooltip contentStyle={{ background: '#111418', border: '1px solid #363c42', borderRadius: 0, color: '#f2f4f5' }} formatter={(value) => [`$${value}`, t('netResult')]} labelStyle={{ color: '#aab0b5' }} />
              <Area type="monotone" dataKey="value" stroke="#1aafff" strokeWidth={2.5} fill="#1aafff" fillOpacity={0.12} activeDot={{ r: 5, fill: '#f2f4f5', stroke: '#1aafff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="account-columns">
        <section className="limits-section">
          <div className="section-heading compact"><div><span className="section-index">02</span><h2>{t('currentLimits')}</h2></div></div>
          <div className="limits-form">
            <label><span>{t('weeklyDeposit')} <small>USD</small></span><input type="number" min="1" value={draft.deposit} onChange={(e) => setDraft({ ...draft, deposit: Number(e.target.value) })} /></label>
            <label><span>{t('weeklyLoss')} <small>USD</small></span><input type="number" min="1" value={draft.loss} onChange={(e) => setDraft({ ...draft, loss: Number(e.target.value) })} /></label>
            <label><span>{t('maxBet')} <small>USD</small></span><input type="number" min="1" value={draft.bet} onChange={(e) => setDraft({ ...draft, bet: Number(e.target.value) })} /></label>
            <label><span>{t('sessionLength')} <small>{t('minutes')}</small></span><select value={draft.session} onChange={(e) => setDraft({ ...draft, session: Number(e.target.value) })}><option value="15">15</option><option value="30">30</option><option value="60">60</option><option value="90">90</option></select></label>
          </div>
          <div className="limits-actions"><button type="button" className="button button-primary" onClick={save}>{t('saveLimits')}</button><span>{t('dataLocal')}</span></div>
          <div className="pause-control"><div><strong>{t('pausePlay')}</strong><p>{t('pauseText')}</p></div><button type="button" className="button button-outline" onClick={onPause} disabled={paused}><CirclePause size={18} />{paused ? t('pausedShort') : t('pausePlay')}</button></div>
        </section>

        <section className="status-section">
          <div className="section-heading compact"><div><span className="section-index">03</span><h2>{t('statusTitle')}</h2></div></div>
          <div className="status-timeline">
            <div className="status-item done"><FileCheck2 size={22} /><div><strong>{t('verified')}</strong><p>{t('verifiedText')}</p></div></div>
            <div className="status-item current"><WalletCards size={22} /><div><strong>{t('withdrawalPending')}</strong><p>{t('withdrawalText')}</p></div></div>
          </div>
          <p className="status-note">{t('noHidden')}</p>
          <div className="bonus-block">
            <span className="eyebrow">{t('bonus')}</span>
            {bonusActive ? <>
              <div className="bonus-value"><strong>$420</strong><span>{t('of')} $1 000</span></div>
              <div className="bonus-track"><span style={{ width: '42%' }} /></div>
              <p>{t('bonusTerms')}</p>
              <button type="button" className="button button-text danger-text" onClick={onBonus}>{t('declineBonus')}</button>
            </> : <p className="bonus-inactive">{t('bonusInactive')}</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
