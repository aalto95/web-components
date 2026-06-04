import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'

export type SelectSize = 'small' | 'medium' | 'large'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export class UiSelect extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    placeholder: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    label: { type: String, reflect: true },
    error: { type: String, reflect: true },
    helperText: { type: String, attribute: 'helper-text', reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    options: { type: Array },
    _open: { type: Boolean, state: true },
    _focusedIdx: { type: Number, state: true },
  }

  declare value: string
  declare placeholder: string
  declare disabled: boolean
  declare name: string
  declare label: string
  declare error: string
  declare helperText: string
  declare required: boolean
  declare size: SelectSize
  declare options: SelectOption[]
  declare _open: boolean
  declare _focusedIdx: number

  constructor() {
    super()
    this.value = ''
    this.placeholder = 'Select an option'
    this.disabled = false
    this.name = ''
    this.label = ''
    this.error = ''
    this.helperText = ''
    this.required = false
    this.size = 'medium'
    this.options = []
    this._open = false
    this._focusedIdx = -1
  }

  private get _selectedLabel(): string {
    const opt = this.options.find((o) => o.value === this.value)
    return opt ? opt.label : ''
  }

  private _toggleOpen(): void {
    if (this.disabled) return
    this._open = !this._open
    if (this._open) {
      this._focusedIdx = Math.max(
        this.options.findIndex((o) => o.value === this.value),
        0,
      )
    }
  }

  private _selectOption(option: SelectOption): void {
    if (option.disabled) return
    this.value = option.value
    this._open = false
    this._dispatchChange()
  }

  private _dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return

    if (!this._open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        this._toggleOpen()
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        this._open = false
        break
      case 'ArrowDown':
        e.preventDefault()
        this._focusedIdx = Math.min(this._focusedIdx + 1, this.options.length - 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        this._focusedIdx = Math.max(this._focusedIdx - 1, 0)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (this._focusedIdx >= 0 && this._focusedIdx < this.options.length) {
          this._selectOption(this.options[this._focusedIdx])
        }
        break
      case 'Tab':
        this._open = false
        break
    }
  }

  private _documentClickHandler = (e: MouseEvent): void => {
    const path = e.composedPath()
    if (!path.includes(this)) {
      this._open = false
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('_open')) {
      if (this._open) {
        document.addEventListener('click', this._documentClickHandler)
        requestAnimationFrame(() => {
          const active = this.shadowRoot?.querySelector('.option--focused')
          active?.scrollIntoView({ block: 'nearest' })
        })
      } else {
        document.removeEventListener('click', this._documentClickHandler)
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('click', this._documentClickHandler)
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: inherit;
      font-size: 1rem;
      position: relative;
    }

    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ui-input-label-fg, #374151);
      line-height: 1;
    }

    .label--required::after {
      content: ' *';
      color: var(--ui-input-error-border, #ef4444);
    }

    .trigger {
      display: flex;
      align-items: center;
      border: 2px solid var(--ui-input-border, #d1d5db);
      border-radius: 6px;
      background: var(--ui-input-bg, #fff);
      cursor: pointer;
      transition: border-color 0.15s;
      gap: 0.375em;
      width: 100%;
      text-align: left;
      font-family: inherit;
      color: var(--ui-input-fg, #111827);
      line-height: 1;
    }

    .trigger:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .trigger--open {
      border-color: var(--ui-focus-ring, #3b82f6);
    }

    :host([error]:not([error=""])) .trigger {
      border-color: var(--ui-input-error-border, #ef4444);
    }

    :host([disabled]) .trigger {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--ui-input-disabled-bg, #f3f4f6);
    }

    .trigger--small {
      padding: 0.375em 0.625em;
      font-size: 0.875rem;
    }

    .trigger--medium {
      padding: 0.5em 0.75em;
      font-size: 1rem;
    }

    .trigger--large {
      padding: 0.625em 0.875em;
      font-size: 1.125rem;
    }

    .trigger-placeholder {
      color: var(--ui-input-placeholder, #9ca3af);
    }

    .trigger-value {
      flex: 1;
      min-width: 0;
    }

    .chevron {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      color: var(--ui-input-icon, #6b7280);
      transition: transform 0.2s;
    }

    .chevron--open {
      transform: rotate(180deg);
    }

    .popup {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      z-index: 10;
      background: var(--ui-calendar-bg, #fff);
      border: 1px solid var(--ui-calendar-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      max-height: 240px;
      overflow-y: auto;
    }

    .option {
      display: flex;
      align-items: center;
      padding: 0.5em 0.75em;
      cursor: pointer;
      font-size: 0.9375rem;
      color: var(--ui-input-fg, #111827);
      transition: background-color 0.1s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
      line-height: 1.25;
    }

    .option:hover,
    .option--focused {
      background: var(--ui-calendar-day-hover-bg, #eff6ff);
    }

    .option--selected {
      font-weight: 600;
      color: var(--ui-primary-bg, #3b82f6);
    }

    .option--disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .option:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: -2px;
    }

    .option + .option {
      border-top: 1px solid var(--ui-calendar-border, #e5e7eb);
    }

    .helper-text {
      font-size: 0.75rem;
      line-height: 1.25;
      color: var(--ui-input-helper-fg, #6b7280);
      min-height: 1em;
    }

    :host([error]:not([error=""])) .helper-text {
      color: var(--ui-input-error-fg, #ef4444);
    }
  `

  render() {
    const hasValue = this.value && this.options.some((o) => o.value === this.value)

    return html`
      <div class="select-wrapper">
        ${
          this.label
            ? html`
          <label class=${classMap({ label: true, 'label--required': this.required })}>
            ${this.label}
          </label>
        `
            : ''
        }
        <button
          class=${classMap({
            trigger: true,
            [`trigger--${this.size}`]: true,
            'trigger--open': this._open,
          })}
          @click=${this._toggleOpen}
          @keydown=${this._handleKeyDown}
          ?disabled=${this.disabled}
          type="button"
          role="combobox"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-label=${ifDefined(this.label || undefined)}
        >
          <span class=${hasValue ? 'trigger-value' : 'trigger-placeholder'}>
            ${hasValue ? this._selectedLabel : this.placeholder}
          </span>
          <span class=${classMap({ chevron: true, 'chevron--open': this._open })}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 5l3 3 3-3"/>
            </svg>
          </span>
        </button>
        ${
          this._open
            ? html`
          <div class="popup" role="listbox">
            ${this.options.map(
              (opt, idx) => html`
              <button
                class=${classMap({
                  option: true,
                  'option--selected': opt.value === this.value,
                  'option--focused': idx === this._focusedIdx,
                  'option--disabled': Boolean(opt.disabled),
                })}
                @click=${() => this._selectOption(opt)}
                ?disabled=${Boolean(opt.disabled)}
                role="option"
                aria-selected=${opt.value === this.value ? 'true' : 'false'}
                type="button"
                tabindex="-1"
              >${opt.label}</button>
            `,
            )}
          </div>
        `
            : ''
        }
        ${
          this.error || this.helperText
            ? html`
          <span class="helper-text">${this.error || this.helperText}</span>
        `
            : ''
        }
      </div>
    `
  }
}

customElements.define('ui-select', UiSelect)
