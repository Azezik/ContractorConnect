import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { upsertContractorProfile } from '../../services/contractorProfileService';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { AVAILABILITY_OPTIONS } from '../../constants/availability';
import { WORK_RADIUS_OPTIONS } from '../../constants/workRadius';
import { ROUTES } from '../../constants/routes';

export function ContractorProfileEditPage() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const { profile, loading: profileLoading } = useContractorProfile(userId);
  const [values, setValues] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (profile && !values) {
      setValues({
        businessName: profile.businessName || '',
        displayName: profile.displayName || '',
        categories: profile.categories || [],
        bio: profile.bio || '',
        postalCode: profile.postalCode || '',
        workRadiusKm: profile.workRadiusKm ? String(profile.workRadiusKm) : '',
        serviceAreaDescription: profile.serviceAreaDescription || profile.serviceArea || '',
        servicesOffered: profile.servicesOffered || [],
        tags: profile.tags || [],
        phone: profile.phone || '',
        website: profile.website || '',
        availabilityStatus: profile.availabilityStatus || 'available',
      });
    }
  }, [profile, values]);

  if (profileLoading) {
    return <Spinner label="Loading profile..." />;
  }

  if (!profile || !values) {
    return (
      <PageContainer>
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Profile not found</h2>
          <p>Complete contractor onboarding to create your profile.</p>
        </Card>
      </PageContainer>
    );
  }

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus('');
  }

  function handleServicesChange(text) {
    const items = text.split('\n').map((s) => s.trim()).filter(Boolean);
    handleChange('servicesOffered', items);
  }

  function handleTagsChange(text) {
    const items = text.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    handleChange('tags', items);
  }

  function handleCategoriesChange(e) {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    if (selected.length) {
      handleChange('categories', selected);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!values.businessName.trim()) {
      setStatus('Business name is required.');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      await upsertContractorProfile({ ownerId: userId, values, imageFiles: [] });
      setStatus('Profile saved successfully.');
    } catch (error) {
      setStatus(error?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Edit profile"
        title="Update your contractor profile"
        description="Changes are saved to your public business profile."
        action={
          <Button variant="secondary" onClick={() => navigate(ROUTES.CONTRACTOR_PROFILE)}>
            View profile
          </Button>
        }
      />
      <form onSubmit={handleSave}>
        <div className="two-column-layout" style={{ alignItems: 'start' }}>
          <div>
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Business identity</h3>
              <div className="form-stack">
                <Input
                  label="Business name"
                  value={values.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                />
                <Input
                  label="Tagline / display name"
                  value={values.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                />
                <Textarea
                  label="Description"
                  rows={4}
                  value={values.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>
            </Card>

            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Services</h3>
              <div className="form-stack">
                <div className="field">
                  <label className="field__label">Categories</label>
                  <p className="field__hint">Hold Ctrl/Cmd to select multiple categories.</p>
                  <select
                    multiple
                    value={values.categories}
                    onChange={handleCategoriesChange}
                    className="input"
                    style={{ minHeight: '120px' }}
                  >
                    {CATEGORY_OPTIONS.filter((o) => o.value).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label">Services offered</label>
                  <p className="field__hint">One service per line.</p>
                  <textarea
                    className="textarea"
                    rows={5}
                    value={values.servicesOffered.join('\n')}
                    onChange={(e) => handleServicesChange(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field__label">Tags</label>
                  <p className="field__hint">Comma-separated keywords (e.g. plumbing, renovation, emergency).</p>
                  <input
                    className="input"
                    value={values.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Service area</h3>
              <div className="form-stack">
                <Input
                  label="Postal code"
                  value={values.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
                <Select
                  label="Work radius"
                  options={WORK_RADIUS_OPTIONS}
                  value={values.workRadiusKm}
                  onChange={(e) => handleChange('workRadiusKm', e.target.value)}
                />
                <Input
                  label="Service area description"
                  value={values.serviceAreaDescription}
                  onChange={(e) => handleChange('serviceAreaDescription', e.target.value)}
                />
              </div>
            </Card>

            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Contact & availability</h3>
              <div className="form-stack">
                <Input
                  label="Phone"
                  value={values.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <Input
                  label="Website"
                  value={values.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
                <Select
                  label="Availability status"
                  options={AVAILABILITY_OPTIONS}
                  value={values.availabilityStatus}
                  onChange={(e) => handleChange('availabilityStatus', e.target.value)}
                />
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.CONTRACTOR_PROFILE)}>
                  Cancel
                </Button>
              </div>
              {status && <p className="inline-note" style={{ marginTop: '0.75rem' }}>{status}</p>}
            </Card>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
