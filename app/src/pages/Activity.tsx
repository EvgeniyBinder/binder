import { useMemo, useState } from 'react'
import { Download, SearchX } from 'lucide-react'
import { transactions, type Transaction } from '../data'
import type { TranslationKey } from '../i18n'

export default function Activity({ t, lang, onToast }: { t: (key: TranslationKey) => string; lang: 'ru' | 'en'; onToast: (message: string) => void }) {
  const [filter, setFilter] = useState<'all' | Transaction['type']>('all')
  const rows = useMemo(() => filter === 'all' ? transactions : transactions.filter((item) => item.type === filter), [filter])
  const exportCsv = () => {
    const header = ['ID', 'Date', 'Type', 'Amount USD', 'Status']
    const body = rows.map((item) => [item.id, item.date, item.type, item.amount, item.status])
    const csv = [header, ...body].map((row) => row.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'aurum-demo-activity.csv'
    link.click()
    URL.revokeObjectURL(url)
    onToast(t('exported'))
  }

  return (
    <div className="page-stack">
      <header className="page-header"><div><span className="eyebrow">A-1024 · USD</span><h1>{t('activityTitle')}</h1><p>{t('activityText')}</p></div><button type="button" className="button button-primary" onClick={exportCsv}><Download size={18} />{t('exportCsv')}</button></header>
      <section className="activity-section">
        <div className="activity-toolbar"><label><span>{t('type')}</span><select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | Transaction['type'])}><option value="all">{t('allTypes')}</option><option value="deposit">{t('deposit')}</option><option value="withdrawal">{t('withdrawal')}</option><option value="bet">{t('bet')}</option><option value="win">{t('win')}</option></select></label><span>{rows.length} / {transactions.length}</span></div>
        {rows.length ? <div className="table-scroll"><table><thead><tr><th>{t('date')}</th><th>{t('operation')}</th><th>ID</th><th>{t('status')}</th><th className="align-right">{t('amount')}</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td>{new Date(item.date).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td><strong>{t(item.type)}</strong></td><td className="mono">{item.id}</td><td><span className={`status-badge ${item.status}`}>{t(item.status)}</span></td><td className={`align-right amount ${item.amount > 0 ? 'positive' : ''}`}>{item.amount > 0 ? '+' : '−'}${Math.abs(item.amount).toFixed(2)}</td></tr>)}</tbody></table></div> : <div className="empty-state"><SearchX size={30} /><h3>{t('noResults')}</h3><button type="button" className="button button-outline" onClick={() => setFilter('all')}>{t('clear')}</button></div>}
      </section>
    </div>
  )
}
