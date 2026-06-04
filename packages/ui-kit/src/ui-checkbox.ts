import { css, html, LitElement } from 'lit'

export class UiCheckbox extends LitElement {
  static properties = {
    checked: { type: Boolean, reflect: true },
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    label: { type: String, reflect: true },
    error: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    indeterminate: { type: Boolean, reflect: true },
  }

  declare checked: boolean
  declare value: string
  declare disabled: boolean
  declare name: string
  declare label: string
  declare error: string
  declare required: boolean
  declare indeterminate: boolean

  constructor() {
    super()
    this.checked = false
    this.value = ''
    this.disabled = false
    this.name = ''
    this.label = ''
    this.error = ''
    this.required = false
    this.indeterminate = false
  }

  private _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement
    this.checked = input.checked
    this.indeterminate = false
    this._dispatchChange()
  }

  private _dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    )
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: inherit;
      font-size: 1rem;
      flex-direction: column;
    }

    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      cursor: pointer;
    }

    :host([disabled]) .checkbox-wrapper {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .checkbox-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .checkbox-visual {
      flex-shrink: 0;
      width: 1.125em;
      height: 1.125em;
      border: 2px solid var(--ui-input-border, #d1d5db);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s, border-color 0.15s;
      background: var(--ui-input-bg, #fff);
    }

    .checkbox-wrapper:hover .checkbox-visual {
      border-color: var(--ui-focus-ring, #3b82f6);
    }

    .checkbox-input:focus-visible + .checkbox-visual {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    :host([checked]) .checkbox-visual {
      background: var(--ui-primary-bg, #3b82f6);
      border-color: var(--ui-primary-bg, #3b82f6);
    }

    :host([indeterminate]) .checkbox-visual {
      background: var(--ui-primary-bg, #3b82f6);
      border-color: var(--ui-primary-bg, #3b82f6);
    }

    :host([error]:not([error=""])) .checkbox-visual {
      border-color: var(--ui-input-error-border, #ef4444);
    }

    :host([error]:not([error=""])):host([checked]) .checkbox-visual,
    :host([error]:not([error=""])):host([indeterminate]) .checkbox-visual {
      background: var(--ui-input-error-border, #ef4444);
      border-color: var(--ui-input-error-border, #ef4444);
    }

    .check-icon {
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label {
      font-size: 0.9375rem;
      color: var(--ui-input-fg, #111827);
      line-height: 1.25;
      user-select: none;
    }

    .error-text {
      font-size: 0.75rem;
      color: var(--ui-input-error-fg, #ef4444);
      margin-top: 0.25em;
    }
  `

  render() {
    return html`
      <div class="field">
        <label class="checkbox-wrapper">
          <input
            class="checkbox-input"
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            .indeterminate=${this.indeterminate}
            @change=${this._handleChange}
            aria-label=${this.label || undefined}
          />
          <span class="checkbox-visual">
            ${
              this.indeterminate
                ? html`
              <span class="check-icon">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" rx="1"/></svg>
              </span>
            `
                : this.checked
                  ? html`
              <span class="check-icon">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 4l3 3 5-5"/>
                </svg>
              </span>
            `
                  : ''
            }
          </span>
          ${this.label ? html`<span class="label">${this.label}</span>` : ''}
          <slot></slot>
        </label>
        ${this.error ? html`<div class="error-text">${this.error}</div>` : ''}
      </div>
    `
  }
}

customElements.define('ui-checkbox', UiCheckbox)
