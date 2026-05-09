import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
          size?: 'small' | 'medium' | 'large'
          loading?: boolean | ''
          disabled?: boolean | ''
          'full-width'?: boolean | ''
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
    }
  }
}
