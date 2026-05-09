import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <div className="app">
      <h1>React + <code>&lt;ui-button&gt;</code></h1>

      <section>
        <h2>Variants</h2>
        <div className="row">
          <ui-button variant="primary">Primary</ui-button>
          <ui-button variant="secondary">Secondary</ui-button>
          <ui-button variant="outline">Outline</ui-button>
          <ui-button variant="ghost">Ghost</ui-button>
        </div>
      </section>

      <section>
        <h2>Sizes</h2>
        <div className="row">
          <ui-button size="small">Small</ui-button>
          <ui-button size="medium">Medium</ui-button>
          <ui-button size="large">Large</ui-button>
        </div>
      </section>

      <section>
        <h2>With React state</h2>
        <div className="row">
          <ui-button
            variant="primary"
            loading={loading ? true : undefined}
            disabled={disabled ? true : undefined}
            onClick={() => alert('Clicked!')}
          >
            {loading ? 'Loading...' : 'Click me'}
          </ui-button>
          <ui-button variant="outline" onClick={() => setLoading(l => !l)}>
            Toggle Loading
          </ui-button>
          <ui-button variant="ghost" onClick={() => setDisabled(d => !d)}>
            Toggle Disabled
          </ui-button>
        </div>
      </section>

      <section>
        <h2>Full width</h2>
        <ui-button full-width variant="secondary">Full Width Button</ui-button>
      </section>

      <section>
        <h2>With icons</h2>
        <div className="row">
          <ui-button>
            <span slot="icon-leading">→</span>
            Leading Icon
          </ui-button>
          <ui-button>
            Trailing Icon
            <span slot="icon-trailing">→</span>
          </ui-button>
        </div>
      </section>
    </div>
  )
}

export default App
