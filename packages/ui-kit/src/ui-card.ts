import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

export type CardVariant = 'outlined' | 'elevated' | 'flat'

export class UiCard extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
  }

  declare variant: CardVariant

  constructor() {
    super()
    this.variant = 'outlined'
  }

  static styles = css`
    :host {
      display: block;
    }

    .card {
      border-radius: 8px;
      padding: 1.25em;
    }

    .card--outlined {
      border: 1px solid var(--ui-card-border, #e5e7eb);
      background: var(--ui-card-bg, #fff);
    }

    .card--elevated {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      background: var(--ui-card-bg, #fff);
    }

    .card--flat {
      background: var(--ui-card-flat-bg, #f9fafb);
    }

    ::slotted([slot="header"]) {
      display: block;
      margin-bottom: 0.75em;
    }

    ::slotted([slot="footer"]) {
      display: block;
      margin-top: 0.75em;
      padding-top: 0.75em;
      border-top: 1px solid var(--ui-card-border, #e5e7eb);
    }
  `

  render() {
    return html`
      <div class=${classMap({ card: true, [`card--${this.variant}`]: true })}>
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `
  }
}

customElements.define('ui-card', UiCard)
