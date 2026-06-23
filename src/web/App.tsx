import { useMemo } from 'react';
import { relativeTime } from '@shared/format';
import { Controls } from './components/Controls';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Pagination } from './components/Pagination';
import { RegionGrid } from './components/RegionGrid';
import { SingleServerHero } from './components/SingleServerHero';
import { SkeletonGrid } from './components/Skeletons';
import { StatusNotice } from './components/StatusNotice';
import { useIncentives } from './hooks/useIncentives';
import { useNow } from './hooks/useNow';
import { useViewState } from './hooks/useViewState';
import { applyControls, type QuickFilter, type SortKey } from './lib/controls';

export default function App() {
  const { data, error, loading, refresh, refreshing } = useIncentives();
  const now = useNow(1000);

  const [view, setView] = useViewState();
  const { search, filter, sort, page } = view;

  const regions = data?.regions ?? [];
  const processed = useMemo(
    () => applyControls(regions, { search, filter, sort }),
    [regions, search, filter, sort],
  );

  const pageSize = data?.pageSize ?? 12;
  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));
  const clampedPage = Math.min(page, pageCount - 1);
  const paged = processed.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize);

  const forced = Boolean(data?.forcedRegion);
  const showControls = !forced;
  const single = forced || processed.length === 1;

  const onSearch = (v: string): void => setView((s) => ({ ...s, search: v, page: 0 }));
  const onFilter = (f: QuickFilter): void => setView((s) => ({ ...s, filter: f, page: 0 }));
  const onSort = (so: SortKey): void => setView((s) => ({ ...s, sort: so }));
  const onPage = (p: number): void => setView((s) => ({ ...s, page: p }));
  const resetControls = (): void => setView((s) => ({ ...s, search: '', filter: 'all', page: 0 }));

  const renderBody = () => {
    if (loading && !data) return <SkeletonGrid />;
    if (error && !data) return <ErrorState message={error.message} onRetry={refresh} />;
    if (processed.length === 0) return <EmptyState onReset={resetControls} />;
    if (single && processed[0]) return <SingleServerHero region={processed[0]} now={now} />;
    return (
      <>
        <RegionGrid regions={paged} now={now} />
        {pageCount > 1 && (
          <div className="mt-8">
            <Pagination page={clampedPage} pageCount={pageCount} onPage={onPage} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header data={data} now={now} onRefresh={refresh} refreshing={refreshing} />
      <DisclaimerBanner />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wide text-bone-100 sm:text-4xl">
                Bloodpoint Incentives
              </h1>
              <p className="mt-1 max-w-xl text-sm text-bone-400">
                Live bonus awarded for playing the under-populated role, per matchmaking region.
              </p>
            </div>
            {data && (
              <p className="text-xs text-bone-500 md:hidden">
                updated {relativeTime(data.updatedAt, now)}
              </p>
            )}
          </div>

          {data && <StatusNotice status={data.status} reason={data.statusReason} />}

          {showControls && data && (
            <Controls
              search={search}
              onSearch={onSearch}
              filter={filter}
              onFilter={onFilter}
              sort={sort}
              onSort={onSort}
              total={regions.length}
              shown={processed.length}
            />
          )}

          <div>{renderBody()}</div>
        </div>

        <Footer data={data} />
      </main>
    </div>
  );
}
