import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { CandidateCard } from './components/CandidateCard';
import { Pagination } from './components/Pagination';
import type { Candidate } from './types/candidate';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    application_type: [] as string[],
    source: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState({ by: 'last_activity', order: 'desc' });

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('per_page', '5');
      if (searchValue) params.append('search', searchValue);

      params.append('sort_by', sort.by);
      params.append('sort_order', sort.order);

      filters.application_type.forEach(type => params.append('application_type', type));
      filters.source.forEach(source => params.append('source', source));

      const response = await fetch(`http://localhost:8000/api/candidates?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setCandidates(data.candidates);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchValue, filters, sort]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSortChange = useCallback((by: string, order: string) => {
    setSort({ by, order });
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((category: 'application_type' | 'source', value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
    setCurrentPage(1); // Reset to page 1 for new filters
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      application_type: [],
      source: []
    });
    setSearchValue('');
    setSort({ by: 'last_activity', order: 'desc' });
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8f7]">
      {/* Page Title */}
      <h1 className="text-[34.59px] font-normal text-[#15372c] px-6 pt-4 pb-3 leading-[46.67px]">All Candidates</h1>

      <div className="flex">
        {/* Sidebar with pre-built components */}
        <Sidebar
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          sort={sort}
          onSortChange={handleSortChange}
        />

        {/* Main Content */}
        <main className="flex-1 px-6">

          {/* Results Summary */}
          <div className="mb-4 flex items-center gap-4 mt-[9px]">
            <p className="text-[13.8px] text-[#222222]">
              Showing {total} candidate applications
            </p>
            <div className="ml-auto flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Application Review
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Collect Feedback
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.application_type.length > 0 || filters.source.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {filters.application_type.map((type) => (
                <span key={`type-${type}`} className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#e6f4f1] text-[#15372c]">
                  {type}
                  <button
                    onClick={() => handleFilterChange('application_type', type)}
                    className="ml-1.5 text-[#15372c] hover:text-[#0b1d17] focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.source.map((src) => (
                <span key={`source-${src}`} className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#e6f4f1] text-[#15372c]">
                  {src}
                  <button
                    onClick={() => handleFilterChange('source', src)}
                    className="ml-1.5 text-[#15372c] hover:text-[#0b1d17] focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Candidate List Header */}
          <div className="bg-neutral-50 border border-[#e1e1e1] border-b-0 rounded-t mb-0">
            <div className="grid grid-cols-[360px_1fr] h-[40px]">
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center border-r border-[#e1e1e1]">Name</div>
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center">Job/Status</div>
            </div>
          </div>

          {/* Candidate List */}
          {isLoading ? (
            <div className="bg-white border-l border-r border-[#e1e1e1] p-8 text-center text-gray-500">
              Loading candidates...
            </div>
          ) : error ? (
            <div className="bg-white border-l border-r border-[#e1e1e1] p-8 text-center text-red-500">
              {error}
            </div>
          ) : candidates.length > 0 ? (
            <div className="bg-white border-l border-r border-[#e1e1e1]">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8 bg-white border border-[#e1e1e1]">
              No candidates found.
            </p>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
