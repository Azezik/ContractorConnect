import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { validateSignup } from '../lib/validation/authValidation';
import { signupWithEmail } from '../services/authService';
import { ROUTES } from '../constants/routes';

const initialValues = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  city: '',
  postalCode: '',
};

export function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, nextValue) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      setFormError('');
      await signupWithEmail(values);
      navigate(ROUTES.ROLE_SELECT);
    } catch (error) {
      setFormError(error.message || 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      description="Everything on Contractor Connect is account-based. Create a real profile first, then choose whether you need work done or you're a contractor."
      aside={
        <>
          <h3>Beta-ready architecture</h3>
          <ul className="feature-list">
            <li>Firebase Auth with email/password</li>
            <li>Firestore user document creation on signup</li>
            <li>Role-based onboarding for customers and contractors</li>
            <li>Future-ready support for messaging, reviews, reports, and settings</li>
          </ul>
        </>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Input label="Full name" value={values.fullName} error={errors.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
          <Input label="Username" value={values.username} error={errors.username} onChange={(e) => handleChange('username', e.target.value)} />
        </div>
        <div className="form-grid">
          <Input label="Email" type="email" value={values.email} error={errors.email} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Password" type="password" value={values.password} error={errors.password} onChange={(e) => handleChange('password', e.target.value)} />
        </div>
        <div className="form-grid">
          <Input label="City" value={values.city} error={errors.city} onChange={(e) => handleChange('city', e.target.value)} />
          <Input label="Postal code" value={values.postalCode} error={errors.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} />
        </div>
        {formError ? <p className="form-error-banner">{formError}</p> : null}
        <Button type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</Button>
        <p className="inline-note">
          Already have an account? <Link to={ROUTES.LOGIN}>Log in</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
