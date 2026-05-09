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
    }
  }
}
