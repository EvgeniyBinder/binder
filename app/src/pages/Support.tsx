import { useState, type FormEvent } from 'react'
import { FilePlus2, MessageSquareText, ShieldCheck } from 'lucide-react'
import type { TranslationKey } from '../i18n'

export interface Ticket { id: string; category: string; subject: string; message: string; date: string; status: 'open' }

export default function Support({ t, lang, tickets, onTickets, onToast }: {
  t: (key: TranslationKey) => string
  lang: 'ru' | 'en'
  tickets: Ticket[]
  onTickets: (tickets: Ticket[]) => void
  onToast: (message: string) => void
}) {
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!category || !subject.trim() || !message.trim()) {
      setError(t('required'))
      return
    }
    const ticket: Ticket = { id: `A-${String(Date.now()).slice(-6)}`, category, subject: subject.trim(), message: message.trim(), date: new Date().toISOString(), status: 'open' }
    onTickets([ticket, ...tickets])
    setCategory(''); setSubject(''); setMessage(''); setError('')
    onToast(t('ticketCreated'))
  }

  return (
    <div className="page-stack">
      <header className="page-header"><div><span className="eyebrow">{t('support')} · {t('demo')}</span><h1>{t('supportTitle')}</h1><p>{t('supportText')}</p></div><MessageSquareText size={42} strokeWidth={1.2} /></header>
      <div className="support-grid">
        <section className="ticket-form-section">
          <div className="section-heading compact"><div><span className="section-index">01</span><h2>{t('newTicket')}</h2></div></div>
          <form className="ticket-form" onSubmit={submit} noValidate>
            <label><span>{t('category')}</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">{t('chooseCategory')}</option><option value="paymentIssue">{t('paymentIssue')}</option><option value="verificationIssue">{t('verificationIssue')}</option><option value="bonusIssue">{t('bonusIssue')}</option><option value="complaint">{t('complaint')}</option><option value="other">{t('other')}</option></select></label>
            <label><span>{t('subject')}</span><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t('subjectPlaceholder')} maxLength={100} /></label>
            <label><span>{t('message')}</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('messagePlaceholder')} rows={6} maxLength={1500} /></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-primary"><FilePlus2 size={18} />{t('sendTicket')}</button>
            <p className="form-note">{t('ticketDemo')}</p>
          </form>
        </section>
        <section className="tickets-section">
          <div className="section-heading compact"><div><span className="section-index">02</span><h2>{t('yourTickets')}</h2></div></div>
          {tickets.length ? <div className="ticket-list">{tickets.map((ticket) => <article key={ticket.id} className="ticket-item"><div><span className="mono">{ticket.id}</span><span className="status-badge pending">{t('open')}</span></div><h3>{ticket.subject}</h3><p>{ticket.message}</p><small>{new Date(ticket.date).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB')} · {t(ticket.category as TranslationKey)}</small></article>)}</div> : <div className="empty-inline"><MessageSquareText size={26} /><p>{t('noTickets')}</p></div>}
        </section>
      </div>
      <section className="faq-section">
        <div className="section-heading compact"><div><span className="section-index">03</span><h2>{t('faq')}</h2></div><ShieldCheck size={26} /></div>
        <div className="faq-list">
          <details><summary>{t('faqRtp')}<span>+</span></summary><p>{t('faqRtpText')}</p></details>
          <details><summary>{t('faqLimits')}<span>+</span></summary><p>{t('faqLimitsText')}</p></details>
          <details><summary>{t('faqData')}<span>+</span></summary><p>{t('faqDataText')}</p></details>
          <details><summary>{t('faqReal')}<span>+</span></summary><p>{t('faqRealText')}</p></details>
        </div>
      </section>
    </div>
  )
}
