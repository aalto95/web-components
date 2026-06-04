import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

export type DialogSize = 'small' | 'medium' | 'large'

export class UiDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    heading: { type: String, reflect: true },
    closable: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
  }

  declare open: boolean
  declare heading: string
  declare closable: boolean
  declare size: DialogSize

  constructor() {
    super()
    this.open = false
    this.heading = ''
    this.closable = true
    this.size = 'medium'
  }

  private _handleDialogClose(): void {
    this.open = false
    this._dispatchClose()
  }

  private _close(): void {
    const dialog = this.shadowRoot?.querySelector('dialog')
    if (dialog?.open) {
      dialog.close()
    }
  }

  private _dispatchClose(): void {
    this.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('open')) {
      const dialog = this.shadowRoot?.querySelector('dialog')
      if (!dialog) return
      if (this.open) {
        if (!dialog.open) dialog.showModal()
      } else {
        if (dialog.open) dialog.close()
      }
    }
  }

  firstUpdated(): void {
    if (this.open) {
      const dialog = this.shadowRoot?.querySelector('dialog')
      if (dialog && !dialog.open) dialog.showModal()
    }
  }

  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      background: var(--ui-dialog-bg, #fff);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: min(90vw, 42em);
      max-height: 85vh;
      width: 100%;
      font-family: inherit;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.4);
    }

    .dialog--small {
      max-width: min(90vw, 24em);
    }

    .dialog--large {
      max-width: min(90vw, 56em);
    }

    .dialog-panel {
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1em 1.25em;
      border-bottom: 1px solid var(--ui-card-border, #e5e7eb);
      min-height: 3em;
    }

    .dialog-heading {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--ui-input-fg, #111827);
      line-height: 1.25;
      margin: 0;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      height: 2em;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 6px;
      color: var(--ui-input-icon, #6b7280);
      flex-shrink: 0;
      font-size: 1.25rem;
      line-height: 1;
    }

    .close-btn:hover {
      background: var(--ui-ghost-hover-bg, #f3f4f6);
      color: var(--ui-input-fg, #111827);
    }

    .close-btn:focus-visible {
      outline: 2px solid var(--ui-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .dialog-body {
      padding: 1.25em;
      overflow-y: auto;
      flex: 1;
    }

    .dialog-footer {
      display: flex;
      align-items: center;
      gap: 0.5em;
      padding: 1em 1.25em;
      border-top: 1px solid var(--ui-card-border, #e5e7eb);
      justify-content: flex-end;
    }
  `

  render() {
    return html`
      <dialog
        class=${classMap({
          dialog: true,
          [`dialog--${this.size}`]: true,
        })}
        @close=${this._handleDialogClose}
      >
        <div class="dialog-panel">
          <div class="dialog-header">
            ${
              this.heading
                ? html`
              <h2 class="dialog-heading">${this.heading}</h2>
            `
                : html`<slot name="heading"></slot>`
            }
            ${
              this.closable
                ? html`
              <button class="close-btn" @click=${this._close} type="button" aria-label="Close">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M4 4l8 8M12 4l-8 8"/>
                </svg>
              </button>
            `
                : ''
            }
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </dialog>
    `
  }
}

customElements.define('ui-dialog', UiDialog)
