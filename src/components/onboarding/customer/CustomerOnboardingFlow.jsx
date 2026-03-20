import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiStepShell } from '../../ui/MultiStepShell';
import { Button } from '../../ui/Button';
import { StepProgress } from '../StepProgress';
import { CustomerIntroStep } from './CustomerIntroStep';
import { JobBasicsStep } from './JobBasicsStep';
import { JobDetailsStep } from './JobDetailsStep';
import { JobImagesStep } from './JobImagesStep';
import { JobReviewStep } from './JobReviewStep';
import { validateCustomerOnboarding } from '../../../lib/validation/onboardingValidation';
import { createJobPost } from '../../../services/jobPostService';
import { markOnboardingComplete } from '../../../services/userService';
import { ROUTES } from '../../../constants/routes';
import { useAsyncState } from '../../../hooks/useAsyncState';

const STEPS = ['Intro', 'Basics', 'Details', 'Images', 'Review'];

const initialValues = {
  title: '',
  category: '',
  description: '',
  city: '',
  postalCode: '',
  tags: [],
  budget: '',
  timeline: '',
  imageFiles: [],
  primaryImageIndex: 0,
};

export function CustomerOnboardingFlow({ userId, userDoc }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    ...initialValues,
    city: userDoc?.city || '',
    postalCode: userDoc?.postalCode || '',
  });
  const [errors, setErrors] = useState({});
  const { loading, error, start, fail, succeed } = useAsyncState();

  useEffect(() => {
    setValues((current) => ({
      ...current,
      city: current.city || userDoc?.city || '',
      postalCode: current.postalCode || userDoc?.postalCode || '',
    }));
  }, [userDoc]);

  const stepComponent = useMemo(() => {
    switch (step) {
      case 1:
        return <CustomerIntroStep />;
      case 2:
        return <JobBasicsStep values={values} errors={errors} onChange={handleChange} />;
      case 3:
        return <JobDetailsStep values={values} errors={errors} onChange={handleChange} />;
      case 4:
        return (
          <JobImagesStep
            values={values}
            errors={errors}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
          />
        );
      default:
        return (
          <JobReviewStep
            values={values}
            errors={errors}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            onSelectPrimaryImage={handleSelectPrimaryImage}
          />
        );
    }
  }, [step, values, errors]);

  function handleChange(field, nextValue) {
    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleAddImages(nextFiles) {
    setValues((current) => {
      const imageFiles = [...current.imageFiles, ...nextFiles];
      return {
        ...current,
        imageFiles,
        primaryImageIndex: imageFiles.length && current.imageFiles.length === 0 ? 0 : current.primaryImageIndex,
      };
    });
    setErrors((current) => {
      if (!current.imageFiles) return current;
      const nextErrors = { ...current };
      delete nextErrors.imageFiles;
      return nextErrors;
    });
  }

  function handleRemoveImage(indexToRemove) {
    setValues((current) => {
      const imageFiles = current.imageFiles.filter((_, index) => index !== indexToRemove);
      const primaryImageIndex = imageFiles.length
        ? Math.min(current.primaryImageIndex > indexToRemove ? current.primaryImageIndex - 1 : current.primaryImageIndex, imageFiles.length - 1)
        : 0;

      return {
        ...current,
        imageFiles,
        primaryImageIndex,
      };
    });
  }

  function handleSelectPrimaryImage(index) {
    setValues((current) => ({ ...current, primaryImageIndex: index }));
  }

  function handleNext() {
    const nextErrors = validateCustomerOnboarding(values, step - 1);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep((current) => Math.min(current + 1, STEPS.length));
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit() {
    const nextErrors = validateCustomerOnboarding(values, 4);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      start();
      await createJobPost({
        ownerId: userId,
        ownerSnapshot: {
          fullName: userDoc?.fullName || '',
          city: userDoc?.city || values.city,
          postalCode: userDoc?.postalCode || values.postalCode,
        },
        values,
        imageFiles: values.imageFiles,
        primaryImageIndex: values.primaryImageIndex,
      });
      await markOnboardingComplete(userId, 'customer');
      succeed();
      navigate(ROUTES.CUSTOMER_HOME);
    } catch (submitError) {
      fail(submitError.message || 'Unable to publish your job right now.');
    }
  }

  return (
    <MultiStepShell
      eyebrow="Customer onboarding"
      title="Post your first project"
      description="Set up your account and publish a real job post tonight."
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
              {loading ? 'Publishing…' : 'Publish job post'}
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
