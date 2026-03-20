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
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { EmptyState } from '../../components/ui/EmptyState';
import { evaluateContractorJobMatch } from '../../lib/matching/matchingModel';

export function JobFeedPage() {
  const { authUser } = useAuth();
  const { jobs, loading, error } = useJobs();
  const { profile, loading: profileLoading } = useContractorProfile(authUser?.uid);
  const [filters, setFilters] = useState({ search: '', category: '', city: '', tag: '' });

  const matchedJobs = useMemo(() => {
    if (!profile?.matchingProfile?.categories?.length) {
      return jobs;
    }

    return jobs
      .map((job) => ({
        job,
        match: evaluateContractorJobMatch({
          contractorProfile: profile,
          jobPost: job,
        }),
      }))
      .filter(({ match }) => match.eligible)
      .sort((left, right) => right.match.score - left.match.score)
      .map(({ job }) => job);
  }, [jobs, profile]);

  const filteredJobs = useMemo(() => {
    return matchedJobs.filter((job) => {
      const matchesSearch = !filters.search || [job.title, job.description].join(' ').toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesCity = !filters.city || job.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesTag = !filters.tag || (job.tags || []).some((tag) => tag.includes(filters.tag.toLowerCase()));
      return matchesSearch && matchesCategory && matchesCity && matchesTag;
    });
  }, [matchedJobs, filters]);

  if (loading || profileLoading) {
    return <Spinner label="Loading your matched jobs…" />;
  }

  if (error) {
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Contractor feed"
          title="Matched jobs"
          description="We keep this feed aligned to your contractor profile, and it should always resolve to jobs, zero matches, or a clear fallback."
        />
        <EmptyState
          title="We couldn’t load matches right now"
          description="The feed request completed with an error instead of hanging. Please refresh and try again."
          action={<p className="empty-state__meta empty-state__meta--error">{error}</p>}
        />
      </PageContainer>
    );
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Contractor feed"
        title="Matched local jobs"
        description="We use your current contractor profile to surface eligible work first, then let you refine that list with search and filters."
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
      {filteredJobs.length ? <JobFeedList jobs={filteredJobs} /> : <EmptyJobState hasFilters={hasFilters} availableCount={matchedJobs.length} />}
    </PageContainer>
  );
}
