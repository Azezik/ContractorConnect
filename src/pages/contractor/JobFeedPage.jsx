import { useMemo, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyJobState } from '../../components/jobs/EmptyJobState';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { EmptyState } from '../../components/ui/EmptyState';
import { buildContractorJobFeed } from '../../lib/matching/matchingModel';
import { ACCOUNT_ROLES } from '../../constants/roles';
import { getDismissedJobIds, dismissJob, restoreAllDismissedJobs } from '../../services/dismissedJobService';

export function JobFeedPage() {
  const { authUser } = useAuth();
  const userId = authUser?.uid;
  const { jobs, loading, error } = useJobs();
  const { profile, loading: profileLoading } = useContractorProfile(userId);
  const [filters, setFilters] = useState({ search: '', category: '', city: '', tag: '' });
  const [dismissedIds, setDismissedIds] = useState(() => getDismissedJobIds(userId));

  const feedState = useMemo(() => buildContractorJobFeed({ contractorProfile: profile, jobs }), [jobs, profile]);

  const matchedJobs = useMemo(() => feedState.results.map(({ job, match }) => ({ ...job, match })), [feedState.results]);

  const visibleJobs = useMemo(
    () => matchedJobs.filter((job) => !dismissedIds.includes(job.id)),
    [matchedJobs, dismissedIds],
  );

  const filteredJobs = useMemo(() => {
    return visibleJobs.filter((job) => {
      const matchesSearch = !filters.search || [job.title, job.description].join(' ').toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesCity = !filters.city || job.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesTag = !filters.tag || (job.tags || []).some((tag) => tag.includes(filters.tag.toLowerCase()));
      return matchesSearch && matchesCategory && matchesCity && matchesTag;
    });
  }, [visibleJobs, filters]);

  function handleDismiss(jobId) {
    dismissJob(userId, jobId);
    setDismissedIds(getDismissedJobIds(userId));
  }

  function handleRestoreAll() {
    restoreAllDismissedJobs(userId);
    setDismissedIds([]);
  }

  if (loading || profileLoading) {
    return <Spinner label="Loading your matched jobs..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Job feed"
          title="Matched jobs"
          description="Jobs matched to your services and service area."
        />
        <EmptyState
          title="Unable to load matches"
          description="Please refresh and try again."
          action={<p className="empty-state__meta empty-state__meta--error">{error}</p>}
        />
      </PageContainer>
    );
  }

  const hasFilters = Object.values(filters).some(Boolean);
  const hiddenCount = matchedJobs.length - visibleJobs.length;

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Job feed"
        title="Matched local jobs"
        description={`${feedState.summary.activeJobCount} active job${feedState.summary.activeJobCount === 1 ? '' : 's'} evaluated against your profile. Showing ${visibleJobs.length} eligible match${visibleJobs.length === 1 ? '' : 'es'}.`}
      />
      <div className="filters card">
        <Input label="Keyword" value={filters.search} onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))} />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={filters.category}
          onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
        />
        <Input label="City" value={filters.city} onChange={(e) => setFilters((current) => ({ ...current, city: e.target.value }))} />
        <Input label="Tag" value={filters.tag} onChange={(e) => setFilters((current) => ({ ...current, tag: e.target.value }))} />
      </div>
      {hiddenCount > 0 && (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <small style={{ color: 'var(--color-text-muted, #666)' }}>
            {hiddenCount} hidden job{hiddenCount === 1 ? '' : 's'}
          </small>
          <Button variant="ghost" onClick={handleRestoreAll} style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
            Restore all
          </Button>
        </div>
      )}
      {filteredJobs.length ? (
        <JobFeedList jobs={filteredJobs} viewerRole={ACCOUNT_ROLES.CONTRACTOR} onDismiss={handleDismiss} />
      ) : (
        <EmptyJobState
          hasFilters={hasFilters}
          availableCount={visibleJobs.length}
          totalActiveJobs={feedState.summary.activeJobCount}
        />
      )}
    </PageContainer>
  );
}
