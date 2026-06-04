import { css, html, LitElement } from 'lit'

export class UiToggle extends LitElement {
  static properties = {
    checked: { type: Boolean, reflect: true },
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    label: { type: String, reflect: true },
    onLabel: { type: String, attribute: 'on-label', reflect: true },
    offLabel: { type: String, attribute: 'off-label', reflect: true },
  }

  declare checked: boolean
  declare value: string
  declare disabled: boolean
  declare name: string
  declare label: string
  declare onLabel: string
  declare offLabel: string

  constructor() {
    super()
    this.checked = false
    this.value = ''
    this.disabled = false
    this.name = ''
    this.label = ''
    this.onLabel = ''
    this.offLabel = ''
  }

  private _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement
    this.checked = input.checked
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
    }

    .toggle-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      cursor: pointer;
    }

    :host([disabled]) .toggle-wrapper {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toggle-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .toggle-track {
      position: relative;
      flex-shrink: 0;
      width: 2.5em;
      height: 1.5em;
      border-radius: 0.75em;
      background: var(--ui-toggle-off-bg, #d1d5db);
      transition: background-color 0.2s;
    }

    :host([checked]) .toggle-track {
      background: var(--ui-primary-bg, #3b82f6);
    }

    .toggle-thumb {
      position: absolute;
      top: 0.1875em;
      left: 0.1875em;
      width: 1.125em;
      height: 1.125em;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }

    :host([checked]) .toggle-thumb {
      transform: translateX(1em);
    }

    .toggle-input:focus-visible + .toggle-track {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .label {
      font-size: 0.9375rem;
      color: var(--ui-input-fg, #111827);
      user-select: none;
      line-height: 1.25;
    }

    .state-label {
      font-size: 0.8125rem;
      color: var(--ui-input-helper-fg, #6b7280);
      user-select: none;
      min-width: 2em;
    }
  `

  render() {
    return html`
      <label class="toggle-wrapper">
        <input
          class="toggle-input"
          type="checkbox"
          role="switch"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name}
          @change=${this._handleChange}
          aria-label=${this.label || undefined}
        />
        <span class="toggle-track">
          <span class="toggle-thumb"></span>
        </span>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
        ${this.checked && this.onLabel ? html`<span class="state-label">${this.onLabel}</span>` : ''}
        ${!this.checked && this.offLabel ? html`<span class="state-label">${this.offLabel}</span>` : ''}
        <slot></slot>
      </label>
    `
  }
}

customElements.define('ui-toggle', UiToggle)
