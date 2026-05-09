import { useState, useRef, useEffect, type FormEvent } from 'react'
import './App.css'

interface FormData {
  name: string
  email: string
  dob: string
  password: string
}

interface FormErrors {
  name?: string
  email?: string
  dob?: string
  password?: string
}

const initialForm: FormData = { name: '', email: '', dob: '', password: '' }

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

function App() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState<FormData | null>(null)

  const nameRef = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLElement>(null)
  const dobRef = useRef<HTMLElement>(null)
  const passwordRef = useRef<HTMLElement>(null)

  const updateField = (field: keyof FormData) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  useInputEvent(nameRef, 'input', updateField('name'))
  useInputEvent(emailRef, 'input', updateField('email'))
  useInputEvent(dobRef, 'change', updateField('dob'))
  useInputEvent(passwordRef, 'input', updateField('password'))

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
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(form)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(null)
    if (nameRef.current) (nameRef.current as any).value = ''
    if (emailRef.current) (emailRef.current as any).value = ''
    if (dobRef.current) (dobRef.current as any).value = ''
    if (passwordRef.current) (passwordRef.current as any).value = ''
  }

  return (
    <div className="app">
      <h1>Registration Form</h1>

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

        <div className="form-actions">
          <ui-button type="submit" variant="primary">Register</ui-button>
          <ui-button type="button" variant="ghost" onClick={handleReset}>Reset</ui-button>
        </div>
      </form>

      {submitted && (
        <div className="success">
          <h2>Submission Received</h2>
          <pre>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
