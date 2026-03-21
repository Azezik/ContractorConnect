import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { toUserFacingErrorMessage } from '../lib/firebase/firebaseErrorUtils';
import { validateLogin } from '../lib/validation/authValidation';
import { loginWithEmail } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, nextValue) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      setFormError('');
      await loginWithEmail(values);
      navigate(location.state?.from || ROUTES.DASHBOARD);
    } catch (error) {
      setFormError(toUserFacingErrorMessage(error, 'Login failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Log in"
      description="Sign into your Contractor Connect account to manage jobs, browse local work, and message through the platform."
      aside={
        <>
          <h3>What you can do after login</h3>
          <ul className="feature-list">
            <li>Create or manage job posts</li>
            <li>Build a contractor profile</li>
            <li>Browse the live job feed</li>
            <li>Use in-platform messaging and reporting tools</li>
          </ul>
        </>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <Input
          id="login-email"
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        {formError ? <p className="form-error-banner">{formError}</p> : null}
        <Button type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</Button>
        <p className="inline-note">
          Need an account? <Link to={ROUTES.SIGNUP}>Create one here</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
