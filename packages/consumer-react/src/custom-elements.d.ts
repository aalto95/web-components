import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-badge': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
          size?: 'small' | 'medium' | 'large'
          removable?: boolean | ''
        },
        HTMLElement
      >

      'ui-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
          size?: 'small' | 'medium' | 'large'
          loading?: boolean | ''
          disabled?: boolean | ''
          'full-width'?: boolean | ''
          type?: 'button' | 'submit' | 'reset'
        },
        HTMLElement
      >

      'ui-card': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'outlined' | 'elevated' | 'flat'
        },
        HTMLElement
      >

      'ui-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean | ''
          value?: string
          disabled?: boolean | ''
          name?: string
          label?: string
          error?: string
          required?: boolean | ''
          indeterminate?: boolean | ''
        },
        HTMLElement
      >

      'ui-datepicker': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string
          min?: string
          max?: string
          disabled?: boolean | ''
          locale?: string
          'first-day-of-week'?: number | ''
          placeholder?: string
          name?: string
          label?: string
          error?: string
        },
        HTMLElement
      >

      'ui-dialog': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean | ''
          heading?: string
          closable?: boolean | ''
          size?: 'small' | 'medium' | 'large'
        },
        HTMLElement
      >

      'ui-input': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string
          placeholder?: string
          disabled?: boolean | ''
          readonly?: boolean | ''
          type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
          name?: string
          size?: 'small' | 'medium' | 'large'
          label?: string
          'helper-text'?: string
          error?: string
          required?: boolean | ''
          autocomplete?: string
        },
        HTMLElement
      >

      'ui-select': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string
          placeholder?: string
          disabled?: boolean | ''
          name?: string
          label?: string
          error?: string
          'helper-text'?: string
          required?: boolean | ''
          size?: 'small' | 'medium' | 'large'
        },
        HTMLElement
      >

      'ui-toggle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean | ''
          value?: string
          disabled?: boolean | ''
          name?: string
          label?: string
          'on-label'?: string
          'off-label'?: string
        },
        HTMLElement
      >
    }
  }
}
