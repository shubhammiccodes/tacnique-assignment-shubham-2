# Submission Notes

**TEMPLATE - Complete this form when submitting your work**

**Candidate Name**: Antigravity (on behalf of User)
**Date**: 2026-01-18
**Time Spent**: ~1 hour

## What I Completed

### Frontend
- [x] Sidebar search input (Pre-built)
- [x] Full Text Search toggle (Pre-built)
- [x] Sort dropdown (Fully functional)
- [x] Collapsible filter sections (Pre-built structure, wired Application Type & Source)
- [x] Reset Filters button (Implemented logic)
- [x] Candidate list display (Pre-built)
- [x] Candidate card components (Pre-built)
- [x] Pagination component (Pre-built UI, wired logic)
- [x] Search filtering functionality (Wired to backend)
- [x] Sort functionality (Backend ready, frontend state implemented)
- [x] Pagination logic (Server-side implemented and wired)

### Backend
- [x] GET /api/candidates endpoint
- [x] Filtering by search term
- [x] Sorting logic (Multi-field, multi-direction)
- [x] Pagination logic (Calculated slices and totals)
- [x] CORS configuration (Pre-built)

### Styling
- [x] Visual accuracy to design (Pre-built components used)
- [x] Hover states (Pre-built)
- [x] Focus states (Pre-built)
- [x] Responsive layout (Pre-built)

## What I Would Do With More Time

1.  **Add "Jobs" Filter**: Implement the backend to return available job facets and render them dynamically in the Sidebar. Currently, only manual typing or hardcoded lists would work without facets.
2.  **Add Loading Skeletons**: Instead of a simple "Loading..." text, I would add skeleton screens for a smoother experience.
3.  **Unit Tests**: Add `pytest` for backend and `vitest` for frontend components.
4.  **Debounce Search**: Ensure search input is properly debounced to avoid excessive API calls (Sidebar component seems to handle this, but verifying it would be good).
5.  **Error Boundaries**: Implement React Error Boundaries for better crash handling.

## Libraries/Packages Added

- `requests`: Added to backend for `test_api.py` (verification script).

## AI Tools Used

- **Antigravity**: Used for end-to-end implementation and verification of the fullstack assessment.

## Challenges & Solutions

- **Challenge**: Wiring multiple list filters (application_type, source) to FastAPI.
- **Solution**: Used `URLSearchParams` with `append` in frontend to correctly format query parameters as `key=value&key=value2`, which FastAPI interprets as a list.

## Additional Notes

The backend implementation handles case-insensitive filtering for better user experience. The frontend now includes a loading state to provide feedback during data fetching.
