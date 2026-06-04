import { css, html, LitElement } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
export type InputSize = 'small' | 'medium' | 'large'

export class UiInput extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    placeholder: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    name: { type: String, reflect: true },
    size: { type: String, reflect: true },
    label: { type: String, reflect: true },
    helperText: { type: String, attribute: 'helper-text', reflect: true },
    error: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    autocomplete: { type: String, reflect: true },
  }

  declare value: string
  declare placeholder: string
  declare disabled: boolean
  declare readonly: boolean
  declare type: InputType
  declare name: string
  declare size: InputSize
  declare label: string
  declare helperText: string
  declare error: string
  declare required: boolean
  declare autocomplete: string

  constructor() {
    super()
    this.value = ''
    this.placeholder = ''
    this.disabled = false
    this.readonly = false
    this.type = 'text'
    this.name = ''
    this.size = 'medium'
    this.label = ''
    this.helperText = ''
    this.required = false
    this.autocomplete = ''
  }

  private _onInput(e: Event): void {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this._dispatchInput()
  }

  private _onChange(_e: Event): void {
    this._dispatchChange()
  }

  private _dispatchInput(): void {
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
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

  static styles = css`
    :host {
      display: inline-block;
      font-family: inherit;
      font-size: 1rem;
    }

    :host([full-width]) {
      display: flex;
    }

    :host([full-width]) .input-container {
      width: 100%;
    }

    .input-wrapper {
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

    .input-container {
      display: flex;
      align-items: center;
      border: 2px solid var(--ui-input-border, #d1d5db);
      border-radius: 6px;
      background: var(--ui-input-bg, #fff);
      transition: border-color 0.15s;
      gap: 0.375em;
    }

    .input-container:focus-within {
      border-color: var(--ui-focus-ring, #3b82f6);
    }

    :host([error]:not([error=""])) .input-container {
      border-color: var(--ui-input-error-border, #ef4444);
    }

    :host([error]:not([error=""])) .input-container:focus-within {
      border-color: var(--ui-input-error-border, #ef4444);
      box-shadow: 0 0 0 1px var(--ui-input-error-border, #ef4444);
    }

    .input-container input {
      flex: 1;
      border: none;
      outline: none;
      font-family: inherit;
      background: transparent;
      color: var(--ui-input-fg, #111827);
      min-width: 0;
      line-height: 1;
      padding: 0;
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

    ::slotted([slot="leading"]),
    ::slotted([slot="trailing"]) {
      display: flex;
      align-items: center;
      color: var(--ui-input-icon, #6b7280);
      flex-shrink: 0;
    }

    .input-container--small {
      padding: 0.375em 0.625em;
      font-size: 0.875rem;
      gap: 0.25em;
    }

    .input-container--medium {
      padding: 0.5em 0.75em;
      font-size: 1rem;
      gap: 0.375em;
    }

    .input-container--large {
      padding: 0.625em 0.875em;
      font-size: 1.125rem;
      gap: 0.5em;
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
    const containerClasses = {
      'input-container': true,
      [`input-container--${this.size}`]: true,
    }

    return html`
      <div class="input-wrapper">
        ${
          this.label
            ? html`
          <label class=${classMap({ label: true, 'label--required': this.required })}>
            ${this.label}
          </label>
        `
            : ''
        }
        <div class=${classMap(containerClasses)}>
          <slot name="leading"></slot>
          <input
            .value=${live(this.value)}
            @input=${this._onInput}
            @change=${this._onChange}
            type=${ifDefined(this.type)}
            placeholder=${ifDefined(this.placeholder || undefined)}
            name=${ifDefined(this.name || undefined)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            autocomplete=${ifDefined(this.autocomplete || undefined)}
            aria-label=${ifDefined(this.label || undefined)}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${ifDefined(this.error || this.helperText ? 'helper' : undefined)}
          >
          <slot name="trailing"></slot>
        </div>
        ${
          this.error || this.helperText
            ? html`
          <span class="helper-text" id="helper">${this.error || this.helperText}</span>
        `
            : ''
        }
      </div>
    `
  }
}

customElements.define('ui-input', UiInput)
