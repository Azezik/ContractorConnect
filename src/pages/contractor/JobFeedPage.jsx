import { useMemo, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { useJobs } from '../../hooks/useJobs';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyJobState } from '../../components/jobs/EmptyJobState';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CATEGORY_OPTIONS } from '../../constants/categories';

export function JobFeedPage() {
  const { jobs, loading } = useJobs();
  const [filters, setFilters] = useState({ search: '', category: '', city: '', tag: '' });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !filters.search || [job.title, job.description].join(' ').toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesCity = !filters.city || job.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesTag = !filters.tag || (job.tags || []).some((tag) => tag.includes(filters.tag.toLowerCase()));
      return matchesSearch && matchesCategory && matchesCity && matchesTag;
    });
  }, [jobs, filters]);

  if (loading) {
    return <Spinner label="Loading active jobs…" />;
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Contractor feed"
        title="Browse active local job posts"
        description="Phase 1 feed is stable and live. Search and filter foundations are already in place for future matching improvements."
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
      {filteredJobs.length ? <JobFeedList jobs={filteredJobs} /> : <EmptyJobState />}
    </PageContainer>
  );
}
