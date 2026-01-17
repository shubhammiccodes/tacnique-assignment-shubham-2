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

  const fetchCandidates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('per_page', '5');
      if (searchValue) params.append('search', searchValue);

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
    }
  }, [currentPage, searchValue, filters]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (category: 'application_type' | 'source', value: string) => {
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
  };

  const handleResetFilters = () => {
    setFilters({
      application_type: [],
      source: []
    });
    setSearchValue('');
    setCurrentPage(1);
  }

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
        />

        {/* Main Content */}
        <main className="flex-1 px-6">

          {/* Results Summary */}
          <div className="mb-4 flex items-center gap-4 mt-[9px]">
            <p className="text-[13.8px] text-[#222222]">
              Showing {total} candidate applications
            </p>
            {/* TODO: Add action buttons (Generate Report, Add Candidate, Bulk Actions) */}
          </div>

          {/* Candidate List Header */}
          <div className="bg-neutral-50 border border-[#e1e1e1] border-b-0 rounded-t mb-0">
            <div className="grid grid-cols-[360px_1fr] h-[40px]">
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center border-r border-[#e1e1e1]">Name</div>
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center">Job/Status</div>
            </div>
          </div>

          {/* Candidate List */}
          {candidates.length > 0 ? (
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
          {totalPages > 1 && (
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
