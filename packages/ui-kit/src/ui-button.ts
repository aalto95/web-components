import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'small' | 'medium' | 'large'

export class UiButton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { type: Boolean, attribute: 'full-width', reflect: true },
    type: { type: String, reflect: true },
  }

  declare variant: ButtonVariant
  declare size: ButtonSize
  declare loading: boolean
  declare disabled: boolean
  declare fullWidth: boolean
  declare type: string

  constructor() {
    super()
    this.variant = 'primary'
    this.size = 'medium'
    this.loading = false
    this.disabled = false
    this.fullWidth = false
    this.type = 'button'
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([full-width]) {
      display: flex;
    }

    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      border: 2px solid transparent;
      border-radius: 6px;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
      text-decoration: none;
      line-height: 1;
      white-space: nowrap;
      width: 100%;
    }

    .btn:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .btn:disabled,
    .btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .btn--primary {
      background-color: var(--ui-primary-bg, #3b82f6);
      color: var(--ui-primary-fg, #fff);
      border-color: var(--ui-primary-bg, #3b82f6);
    }
    .btn--primary:hover:not(:disabled) {
      background-color: var(--ui-primary-hover, #2563eb);
      border-color: var(--ui-primary-hover, #2563eb);
    }

    .btn--secondary {
      background-color: var(--ui-secondary-bg, #6b7280);
      color: var(--ui-secondary-fg, #fff);
      border-color: var(--ui-secondary-bg, #6b7280);
    }
    .btn--secondary:hover:not(:disabled) {
      background-color: var(--ui-secondary-hover, #4b5563);
      border-color: var(--ui-secondary-hover, #4b5563);
    }

    .btn--outline {
      background-color: transparent;
      color: var(--ui-outline-fg, #3b82f6);
      border-color: var(--ui-outline-border, #3b82f6);
    }
    .btn--outline:hover:not(:disabled) {
      background-color: var(--ui-outline-hover-bg, #eff6ff);
    }

    .btn--ghost {
      background-color: transparent;
      color: var(--ui-ghost-fg, #374151);
      border-color: transparent;
    }
    .btn--ghost:hover:not(:disabled) {
      background-color: var(--ui-ghost-hover-bg, #f3f4f6);
    }

    .btn--small {
      padding: 0.375em 0.75em;
      font-size: 0.875rem;
    }
    .btn--medium {
      padding: 0.5em 1em;
      font-size: 1rem;
    }
    .btn--large {
      padding: 0.625em 1.25em;
      font-size: 1.125rem;
    }

    .spinner {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    :host([loading]) .spinner {
      visibility: visible;
    }

    :host([loading]) .slot-wrapper {
      visibility: hidden;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .slot-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
    }
  `

  private _handleClick(e: Event): void {
    if (this.loading || this.disabled) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }

  render() {
    const classes = {
      btn: true,
      [`btn--${this.variant}`]: true,
      [`btn--${this.size}`]: true,
    }

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled || this.loading}
        type=${ifDefined(this.type)}
        @click=${this._handleClick}
      >
        <span class="spinner"></span>
        <span class="slot-wrapper">
          <slot name="icon-leading"></slot>
          <slot></slot>
          <slot name="icon-trailing"></slot>
        </span>
      </button>
    `
  }
}

customElements.define('ui-button', UiButton)
