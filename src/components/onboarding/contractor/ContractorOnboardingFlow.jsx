import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiStepShell } from '../../ui/MultiStepShell';
import { StepProgress } from '../StepProgress';
import { Button } from '../../ui/Button';
import { ContractorIntroStep } from './ContractorIntroStep';
import { BusinessInfoStep } from './BusinessInfoStep';
import { ServiceAreaStep } from './ServiceAreaStep';
import { ServicesStep } from './ServicesStep';
import { ContactStep } from './ContactStep';
import { ProfileReviewStep } from './ProfileReviewStep';
import { validateContractorOnboarding } from '../../../lib/validation/onboardingValidation';
import { upsertContractorProfile } from '../../../services/contractorProfileService';
import { markOnboardingComplete } from '../../../services/userService';
import { ROUTES } from '../../../constants/routes';
import { useAsyncState } from '../../../hooks/useAsyncState';

const STEPS = ['Intro', 'Business', 'Area', 'Services', 'Contact', 'Review'];

const initialValues = {
  businessName: '',
  displayName: '',
  categories: [],
  serviceArea: '',
  bio: '',
  servicesOffered: [],
  tags: [],
  phone: '',
  website: '',
  availabilityStatus: 'available',
  imageFiles: [],
};

export function ContractorOnboardingFlow({ userId }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const { loading, error, start, fail, succeed } = useAsyncState();

  const stepComponent = useMemo(() => {
    switch (step) {
      case 1:
        return <ContractorIntroStep />;
      case 2:
        return <BusinessInfoStep values={values} errors={errors} onChange={handleChange} />;
      case 3:
        return <ServiceAreaStep values={values} errors={errors} onChange={handleChange} />;
      case 4:
        return <ServicesStep values={values} errors={errors} onChange={handleChange} />;
      case 5:
        return <ContactStep values={values} onChange={handleChange} />;
      default:
        return <ProfileReviewStep values={values} />;
    }
  }, [step, values, errors]);

  function handleChange(field, nextValue) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  function handleNext() {
    const nextErrors = validateContractorOnboarding(values, step - 1);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep((current) => Math.min(current + 1, STEPS.length));
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit() {
    const nextErrors = validateContractorOnboarding(values, 4);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      start();
      await upsertContractorProfile({ ownerId: userId, values, imageFiles: values.imageFiles });
      await markOnboardingComplete(userId, 'contractor');
      succeed();
      navigate(ROUTES.FEED);
    } catch (submitError) {
      fail(submitError.message || 'Unable to create your contractor profile right now.');
    }
  }

  return (
    <MultiStepShell
      eyebrow="Contractor onboarding"
      title="Build your service profile"
      description="Create a real contractor profile with categories, service area, tags, and availability."
      progress={<StepProgress steps={STEPS} currentStep={step} />}
      footer={
        <div className="step-actions">
          <Button type="button" variant="ghost" disabled={step === 1 || loading} onClick={handleBack}>
            Back
          </Button>
          {step < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="button" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Saving…' : 'Create contractor profile'}
            </Button>
          )}
        </div>
      }
    >
      {stepComponent}
      {error ? <p className="form-error-banner">{error}</p> : null}
    </MultiStepShell>
  );
}
