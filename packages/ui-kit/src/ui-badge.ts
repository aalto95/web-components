import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type BadgeSize = 'small' | 'medium' | 'large'

export class UiBadge extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    removable: { type: Boolean, reflect: true },
  }

  declare variant: BadgeVariant
  declare size: BadgeSize
  declare removable: boolean

  constructor() {
    super()
    this.variant = 'default'
    this.size = 'medium'
    this.removable = false
  }

  private _handleRemove(): void {
    this.dispatchEvent(
      new CustomEvent('remove', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: inherit;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25em;
      border-radius: 9999px;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
    }

    .badge--default {
      background: var(--ui-badge-default-bg, #f3f4f6);
      color: var(--ui-badge-default-fg, #374151);
    }

    .badge--primary {
      background: var(--ui-badge-primary-bg, #dbeafe);
      color: var(--ui-badge-primary-fg, #1d4ed8);
    }

    .badge--success {
      background: var(--ui-badge-success-bg, #d1fae5);
      color: var(--ui-badge-success-fg, #065f46);
    }

    .badge--warning {
      background: var(--ui-badge-warning-bg, #fef3c7);
      color: var(--ui-badge-warning-fg, #92400e);
    }

    .badge--danger {
      background: var(--ui-badge-danger-bg, #fee2e2);
      color: var(--ui-badge-danger-fg, #991b1b);
    }

    .badge--small {
      padding: 0.125em 0.5em;
      font-size: 0.75rem;
    }

    .badge--medium {
      padding: 0.1875em 0.625em;
      font-size: 0.8125rem;
    }

    .badge--large {
      padding: 0.25em 0.75em;
      font-size: 0.9375rem;
    }

    .remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      flex-shrink: 0;
      border-radius: 50%;
      width: 1em;
      height: 1em;
      font-size: inherit;
      line-height: 1;
    }

    .remove-btn:hover {
      opacity: 1;
    }

    .remove-btn:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }
  `

  render() {
    return html`
      <span class=${classMap({
        badge: true,
        [`badge--${this.variant}`]: true,
        [`badge--${this.size}`]: true,
      })}>
        <slot></slot>
        ${
          this.removable
            ? html`
          <button class="remove-btn" @click=${this._handleRemove} type="button" aria-label="Remove">
            <svg width="0.75em" height="0.75em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 3l6 6M9 3l-6 6"/>
            </svg>
          </button>
        `
            : ''
        }
      </span>
    `
  }
}

customElements.define('ui-badge', UiBadge)
