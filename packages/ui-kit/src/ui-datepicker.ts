import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'

export type DatepickerLocale = string

export class UiDatepicker extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    min: { type: String, reflect: true },
    max: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    locale: { type: String, reflect: true },
    firstDayOfWeek: { type: Number, attribute: 'first-day-of-week', reflect: true },
    placeholder: { type: String, reflect: true },
    name: { type: String, reflect: true },
    _open: { type: Boolean, state: true },
    _viewMonth: { type: Number, state: true },
    _viewYear: { type: Number, state: true },
  }

  declare value: string
  declare min: string
  declare max: string
  declare disabled: boolean
  declare locale: string
  declare firstDayOfWeek: number
  declare placeholder: string
  declare name: string
  declare _open: boolean
  declare _viewMonth: number
  declare _viewYear: number

  constructor() {
    super()
    this.value = ''
    this.min = ''
    this.max = ''
    this.disabled = false
    this.locale = 'default'
    this.firstDayOfWeek = 0
    this.placeholder = ''
    this.name = ''
    this._open = false
    const now = new Date()
    this._viewMonth = now.getMonth()
    this._viewYear = now.getFullYear()
  }

  private get _selectedDate(): Date | null {
    if (!this.value) return null
    const d = new Date(`${this.value}T00:00:00`)
    return isNaN(d.getTime()) ? null : d
  }

  private get _minDate(): Date | null {
    if (!this.min) return null
    const d = new Date(`${this.min}T00:00:00`)
    return isNaN(d.getTime()) ? null : d
  }

  private get _maxDate(): Date | null {
    if (!this.max) return null
    const d = new Date(`${this.max}T00:00:00`)
    return isNaN(d.getTime()) ? null : d
  }

  private get _displayValue(): string {
    if (!this.value) return ''
    const d = this._selectedDate
    if (!d) return this.value
    return new Intl.DateTimeFormat(this.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
  }

  private _getMonthLabel(): string {
    return new Intl.DateTimeFormat(this.locale, {
      year: 'numeric',
      month: 'long',
    }).format(new Date(this._viewYear, this._viewMonth, 1))
  }

  private _getDayNames(): string[] {
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'short' })
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      days.push(fmt.format(new Date(2024, 0, 7 + i)))
    }
    if (this.firstDayOfWeek > 0) {
      const shifted = [...days]
      for (let i = 0; i < 7; i++) {
        shifted[i] = days[(i + this.firstDayOfWeek) % 7]
      }
      return shifted
    }
    return days
  }

  private _isDateDisabled(date: Date): boolean {
    if (this.disabled) return true
    if (this._minDate) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const min = new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate())
      if (d < min) return true
    }
    if (this._maxDate) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const max = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate())
      if (d > max) return true
    }
    return false
  }

  private _getCalendarDays() {
    const daysInMonth = new Date(this._viewYear, this._viewMonth + 1, 0).getDate()
    const firstDay = new Date(this._viewYear, this._viewMonth, 1).getDay()
    const daysInPrevMonth = new Date(this._viewYear, this._viewMonth, 0).getDate()
    const startOffset = (firstDay - this.firstDayOfWeek + 7) % 7

    const prevMonth = (this._viewMonth - 1 + 12) % 12
    const prevYear = this._viewMonth === 0 ? this._viewYear - 1 : this._viewYear
    const nextMonth = (this._viewMonth + 1) % 12
    const nextYear = this._viewMonth === 11 ? this._viewYear + 1 : this._viewYear

    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    const days: Array<{
      day: number
      date: Date
      isCurrentMonth: boolean
      isToday: boolean
      isSelected: boolean
      disabled: boolean
    }> = []

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(prevYear, prevMonth, day)
      const ds = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({ day, date, isCurrentMonth: false, isToday: ds === todayStr, isSelected: ds === this.value, disabled: this._isDateDisabled(date) })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this._viewYear, this._viewMonth, i)
      const ds = `${this._viewYear}-${String(this._viewMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ day: i, date, isCurrentMonth: true, isToday: ds === todayStr, isSelected: ds === this.value, disabled: this._isDateDisabled(date) })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(nextYear, nextMonth, i)
      const ds = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ day: i, date, isCurrentMonth: false, isToday: ds === todayStr, isSelected: ds === this.value, disabled: this._isDateDisabled(date) })
    }

    return days
  }

  private _selectDate(date: Date): void {
    if (this._isDateDisabled(date)) return
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    this.value = `${y}-${m}-${d}`
    this._closeCalendar()
    this._dispatchChange()
  }

  private _dispatchChange(): void {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onInputChange(e: Event): void {
    const input = e.target as HTMLInputElement
    const val = input.value.trim()
    if (!val) {
      this.value = ''
      this._dispatchChange()
      return
    }
    const d = new Date(`${val}T00:00:00`)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const iso = `${y}-${m}-${day}`
      if (iso !== this.value) {
        this.value = iso
        this._dispatchChange()
      }
    } else {
      this.requestUpdate()
    }
  }

  private _prevMonth(): void {
    if (this._viewMonth === 0) {
      this._viewMonth = 11
      this._viewYear -= 1
    } else {
      this._viewMonth -= 1
    }
  }

  private _nextMonth(): void {
    if (this._viewMonth === 11) {
      this._viewMonth = 0
      this._viewYear += 1
    } else {
      this._viewMonth += 1
    }
  }

  private _openCalendar(): void {
    if (this.disabled) return
    if (!this._open) {
      const d = this._selectedDate ?? new Date()
      this._viewMonth = d.getMonth()
      this._viewYear = d.getFullYear()
      this._open = true
      document.addEventListener('click', this._documentClickHandler)
    }
  }

  private _closeCalendar(): void {
    if (this._open) {
      this._open = false
      document.removeEventListener('click', this._documentClickHandler)
    }
  }

  private _toggleOpen(): void {
    if (this._open) {
      this._closeCalendar()
    } else {
      this._openCalendar()
    }
  }

  private _documentClickHandler = (e: MouseEvent): void => {
    const path = e.composedPath()
    if (!path.includes(this)) {
      this._closeCalendar()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('click', this._documentClickHandler)
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: inherit;
      font-size: 1rem;
    }

    .datepicker-wrapper {
      position: relative;
    }

    .input-container {
      display: flex;
      align-items: center;
      border: 2px solid var(--ui-input-border, #d1d5db);
      border-radius: 6px;
      background: var(--ui-input-bg, #fff);
      transition: border-color 0.15s;
    }

    .input-container:focus-within {
      border-color: var(--ui-focus-ring, #3b82f6);
    }

    .input-container input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0.5em 0.75em;
      font-family: inherit;
      font-size: 1rem;
      background: transparent;
      color: var(--ui-input-fg, #111827);
      min-width: 0;
      line-height: 1;
    }

    .input-container input::placeholder {
      color: var(--ui-input-placeholder, #9ca3af);
    }

    :host([disabled]) .input-container {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--ui-input-disabled-bg, #f3f4f6);
    }

    :host([disabled]) .input-container input {
      cursor: not-allowed;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.375em;
      margin-right: 2px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--ui-input-icon, #6b7280);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .icon-btn:hover:not(:disabled) {
      color: var(--ui-input-icon-hover, #374151);
      background: var(--ui-input-icon-hover-bg, #f3f4f6);
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: -2px;
    }

    .icon-btn:disabled {
      cursor: not-allowed;
    }

    .calendar-popup {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 10;
      background: var(--ui-calendar-bg, #fff);
      border: 1px solid var(--ui-calendar-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      padding: 1em;
      min-width: 280px;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75em;
    }

    .month-label {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--ui-calendar-month-fg, #111827);
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      height: 2em;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      font-size: 1.125rem;
      color: var(--ui-calendar-nav-fg, #6b7280);
      font-family: inherit;
      line-height: 1;
    }

    .nav-btn:hover:not(:disabled) {
      background: var(--ui-calendar-nav-hover-bg, #f3f4f6);
      color: var(--ui-calendar-nav-hover-fg, #374151);
    }

    .nav-btn:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .day-names {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      margin-bottom: 4px;
    }

    .day-name {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ui-calendar-day-name-fg, #9ca3af);
      padding: 0.375em 0;
      text-transform: uppercase;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      aspect-ratio: 1;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--ui-calendar-day-fg, #374151);
      transition: background-color 0.1s;
      padding: 0;
    }

    .day:hover:not(:disabled) {
      background: var(--ui-calendar-day-hover-bg, #eff6ff);
    }

    .day:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: -2px;
    }

    .day:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .day--other-month {
      color: var(--ui-calendar-other-month-fg, #d1d5db);
    }

    .day--today {
      font-weight: 700;
      color: var(--ui-primary-bg, #3b82f6);
    }

    .day--selected {
      background: var(--ui-primary-bg, #3b82f6);
      color: var(--ui-primary-fg, #fff);
      font-weight: 600;
    }

    .day--selected:hover:not(:disabled) {
      background: var(--ui-primary-hover, #2563eb);
    }

    .day--selected.day--today {
      color: var(--ui-primary-fg, #fff);
    }
  `

  render() {
    const dayNames = this._getDayNames()
    const days = this._getCalendarDays()

    return html`
      <div class="datepicker-wrapper">
        <div class="input-container">
          <input
            .value=${live(this._displayValue)}
            @focus=${this._openCalendar}
            @change=${this._onInputChange}
            placeholder=${ifDefined(this.placeholder || undefined)}
            name=${ifDefined(this.name || undefined)}
            ?disabled=${this.disabled}
            autocomplete="off"
            aria-label="Date input"
          >
          <button
            class="icon-btn"
            @click=${this._toggleOpen}
            ?disabled=${this.disabled}
            type="button"
            aria-label="Toggle calendar"
            tabindex="-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1.5" y="3.5" width="13" height="11" rx="1.5"/>
              <path d="M1.5 6.5h13"/>
              <path d="M5 1.5v3M11 1.5v3"/>
            </svg>
          </button>
        </div>
        ${this._open ? html`
          <div class="calendar-popup" role="dialog" aria-label="Date picker">
            <div class="calendar-header">
              <button
                class="nav-btn"
                @click=${this._prevMonth}
                type="button"
                aria-label="Previous month"
              >‹</button>
              <span class="month-label">${this._getMonthLabel()}</span>
              <button
                class="nav-btn"
                @click=${this._nextMonth}
                type="button"
                aria-label="Next month"
              >›</button>
            </div>
            <div class="day-names" role="row" aria-hidden="true">
              ${dayNames.map(name => html`
                <span class="day-name">${name}</span>
              `)}
            </div>
            <div class="days-grid" role="grid" aria-label="Calendar days">
              ${days.map(d => html`
                <button
                  class=${classMap({
                    day: true,
                    'day--current-month': d.isCurrentMonth,
                    'day--other-month': !d.isCurrentMonth,
                    'day--selected': d.isSelected,
                    'day--today': d.isToday,
                    'day--disabled': d.disabled,
                  })}
                  @click=${() => this._selectDate(d.date)}
                  ?disabled=${d.disabled}
                  type="button"
                  role="gridcell"
                  aria-selected=${d.isSelected ? 'true' : 'false'}
                  aria-label=${d.date.toLocaleDateString(this.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  tabindex=${d.isSelected ? '0' : '-1'}
                >${d.day}</button>
              `)}
            </div>
          </div>
        ` : ''}
      </div>
    `
  }
}

customElements.define('ui-datepicker', UiDatepicker)
