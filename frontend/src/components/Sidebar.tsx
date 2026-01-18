import { useState } from 'react';
import { SearchInput } from './SearchInput';
import { CollapsibleSection } from './CollapsibleSection';

interface SidebarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: {
    application_type: string[];
    source: string[];
  };
  onFilterChange: (category: 'application_type' | 'source', value: string) => void;
  onResetFilters: () => void;
  sort: { by: string; order: string };
  onSortChange: (by: string, order: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  sort,
  onSortChange
}) => {
  const [fullTextSearch, setFullTextSearch] = useState(false);

  return (
    <aside className="w-[248px] bg-[#f7f8f7] min-h-screen px-6 pt-2 pb-6">
      {/* Search Input */}
      <SearchInput value={searchValue} onChange={onSearchChange} />

      {/* Full Text Search Toggle */}
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="fullTextSearch"
              checked={fullTextSearch}
              onChange={(e) => setFullTextSearch(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-[50px] h-[25px] bg-[#ccd4d1] rounded-full peer peer-checked:bg-[#047957] peer-focus:ring-2 peer-focus:ring-[#047957]/20 transition-colors duration-200 ease-in-out">
              <div className={`absolute left-0 top-0 w-[25px] h-[25px] bg-white border-[3px] rounded-full transition-transform duration-200 ease-in-out ${fullTextSearch ? 'translate-x-[25px] border-[#047957]' : 'translate-x-0 border-[#ccd4d1]'}`}></div>
            </div>
          </label>
          <label htmlFor="fullTextSearch" className="text-[13px] font-medium text-[#15372c] cursor-pointer leading-[19.5px]">
            Full Text Search
          </label>
        </div>
        <p className="text-[11.6px] text-[#909090] font-light leading-[12px] mt-1">(Includes resumes and notes)</p>
      </div>

      {/* Sort Dropdown */}
      <div className="mt-4">
        <select
          value={`${sort.by}-${sort.order}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('-');
            onSortChange(by, order);
          }}
          className="w-full h-[36px] px-3 flex items-center justify-between border border-[#e1e1e1] bg-white rounded text-[14px] text-[#333333] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#047957]"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%209L12%2016L5%209%22%20stroke%3D%22%23909090%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
        >
          <option value="last_activity-desc">Last Activity (new to old)</option>
          <option value="last_activity-asc">Last Activity (old to new)</option>
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
        </select>
      </div>

      {/* Filter Sections */}
      <div className="mt-6">
        <CollapsibleSection title="Application Type">
          <div className="space-y-2">
            {['active', 'archived'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.application_type.includes(type)}
                  onChange={() => onFilterChange('application_type', type)}
                  className="rounded border-gray-300 text-[#047957] focus:ring-[#047957]"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Jobs">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>

        <CollapsibleSection title="CRM">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>

        <CollapsibleSection title="Profile Details">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>

        <CollapsibleSection title="Source">
          <div className="space-y-2">
            {['LinkedIn', 'Indeed', 'Referral', 'GitHub'].map((source) => (
              <label key={source} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.source.includes(source)}
                  onChange={() => onFilterChange('source', source)}
                  className="rounded border-gray-300 text-[#047957] focus:ring-[#047957]"
                />
                <span className="text-sm">{source}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Responsibility">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>

        <CollapsibleSection title="Pipeline Tasks">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>

        <CollapsibleSection title="Education">
          {/* TODO: Add filter checkboxes here */}
        </CollapsibleSection>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={onResetFilters}
        className="mt-6 w-full px-4 py-2 text-[#3574d6] text-[13.9px] font-light flex items-center justify-center gap-2 hover:underline">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Reset Filters</span>
      </button>
    </aside>
  );
};
