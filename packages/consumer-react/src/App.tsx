import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'other', label: 'Other' },
]

interface FormData {
  name: string
  email: string
  dob: string
  password: string
  role: string
  notifications: boolean
  terms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  dob?: string
  password?: string
  role?: string
  terms?: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  dob: '',
  password: '',
  role: '',
  notifications: true,
  terms: false,
}

function useInputEvent(
  ref: React.RefObject<HTMLElement | null>,
  event: string,
  handler: (value: string) => void,
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const listener = (e: Event) => {
      handlerRef.current((e as CustomEvent).detail.value ?? '')
    }
    el.addEventListener(event, listener)
    return () => el.removeEventListener(event, listener)
  }, [ref, event])
}

function useCheckEvent(
  ref: React.RefObject<HTMLElement | null>,
  event: string,
  handler: (checked: boolean) => void,
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const listener = (e: Event) => {
      handlerRef.current((e as CustomEvent).detail.checked ?? false)
    }
    el.addEventListener(event, listener)
    return () => el.removeEventListener(event, listener)
  }, [ref, event])
}

function App() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState<FormData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const nameRef = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLElement>(null)
  const dobRef = useRef<HTMLElement>(null)
  const passwordRef = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLElement>(null)
  const termsRef = useRef<HTMLElement>(null)
  const notifRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (roleRef.current) {
      ;(roleRef.current as unknown as Record<string, unknown>).options = roleOptions
    }
  }, [])

  const updateField = (field: keyof FormErrors) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const updateCheck = (field: 'terms') => (checked: boolean) => {
    setForm((prev) => ({ ...prev, [field]: checked }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  useInputEvent(nameRef, 'input', updateField('name'))
  useInputEvent(emailRef, 'input', updateField('email'))
  useInputEvent(dobRef, 'change', updateField('dob'))
  useInputEvent(passwordRef, 'input', updateField('password'))
  useInputEvent(roleRef, 'change', updateField('role'))
  useCheckEvent(termsRef, 'change', updateCheck('terms'))
  useCheckEvent(notifRef, 'change', (checked) => {
    setForm((prev) => ({ ...prev, notifications: checked }))
  })

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email address'
    }
    if (!form.dob) e.dob = 'Date of birth is required'
    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'At least 6 characters'
    }
    if (!form.role) e.role = 'Select a role'
    if (!form.terms) e.terms = 'You must accept the terms'
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(form)
      setDialogOpen(true)
    }
  }

  const handleReset = useCallback(() => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(null)
    if (nameRef.current) (nameRef.current as unknown as Record<string, unknown>).value = ''
    if (emailRef.current) (emailRef.current as unknown as Record<string, unknown>).value = ''
    if (dobRef.current) (dobRef.current as unknown as Record<string, unknown>).value = ''
    if (passwordRef.current) (passwordRef.current as unknown as Record<string, unknown>).value = ''
    if (roleRef.current) (roleRef.current as unknown as Record<string, unknown>).value = ''
    if (termsRef.current) (termsRef.current as unknown as Record<string, unknown>).checked = false
    if (notifRef.current) (notifRef.current as unknown as Record<string, unknown>).checked = true
  }, [])

  return (
    <div className="app">
      <h1>Registration Form</h1>

      <ui-card variant="elevated">
        <div slot="header" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
          Create your account
          <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
            <ui-badge variant="primary" size="small">
              New
            </ui-badge>
            <ui-badge variant="default" size="small">
              Required
            </ui-badge>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <ui-input
            ref={nameRef}
            label="Full Name"
            placeholder="John Doe"
            required
            error={errors.name || undefined}
          />

          <ui-input
            ref={emailRef}
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            error={errors.email || undefined}
          />

          <ui-datepicker
            ref={dobRef}
            label="Date of Birth"
            placeholder="Select your birth date"
            error={errors.dob || undefined}
          />

          <ui-input
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            required
            error={errors.password || undefined}
          />

          <ui-select
            ref={roleRef}
            label="Role"
            placeholder="Select your role"
            error={errors.role || undefined}
          />

          <ui-toggle ref={notifRef} label="Email notifications" on-label="On" off-label="Off" />

          <ui-checkbox
            ref={termsRef}
            label="I accept the terms and conditions"
            error={errors.terms || undefined}
          />

          <div className="form-actions">
            <ui-button type="submit" variant="primary">
              Register
            </ui-button>
            <ui-button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </ui-button>
          </div>
        </form>
      </ui-card>

      <ui-dialog open={dialogOpen} heading="Registration Complete" size="small">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
          <p>Your account has been created successfully.</p>
          {submitted && (
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.375em',
                  flexWrap: 'wrap',
                  marginBottom: '0.75em',
                }}
              >
                <ui-badge variant="success" size="small">
                  Active
                </ui-badge>
                <ui-badge variant="primary" size="small">
                  {submitted.role || 'N/A'}
                </ui-badge>
                <ui-badge variant={submitted.notifications ? 'success' : 'default'} size="small">
                  {submitted.notifications ? 'Notifications On' : 'Notifications Off'}
                </ui-badge>
              </div>
              <pre
                style={{
                  fontSize: '0.8125rem',
                  background: '#f3f4f6',
                  padding: '0.75em',
                  borderRadius: '6px',
                }}
              >
                {JSON.stringify(submitted, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <div slot="footer">
          <ui-button
            variant="primary"
            onClick={() => {
              setDialogOpen(false)
              handleReset()
            }}
          >
            Done
          </ui-button>
        </div>
      </ui-dialog>
    </div>
  )
}

export default App
