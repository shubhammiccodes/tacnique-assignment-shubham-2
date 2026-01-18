from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import json
from pathlib import Path

app = FastAPI(title="Candidate Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock data
DATA_FILE = Path(__file__).parent.parent / "mock-data" / "candidates.json"

def load_candidates():
    """Load candidates from JSON file"""
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
    return data["candidates"]


@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Candidate Management API", "docs": "/docs"}


@app.get("/api/candidates")
def get_candidates(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(5, ge=1, le=50, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, position, or company"),
    sort_by: Optional[str] = Query("last_activity", description="Field to sort by (last_activity, name)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
    application_type: Optional[List[str]] = Query(None, description="Filter by application type"),
    source: Optional[List[str]] = Query(None, description="Filter by source"),
    job_id: Optional[str] = Query(None, description="Filter by job ID"),
):
    """
    Get paginated and filtered candidates

    YOUR TASK: Implement a complete backend API with:
    1. Multi-field filtering (search, application_type, source, job_id)
    2. Flexible sorting (by last_activity or name, asc or desc)
    3. Server-side pagination
    4. Proper response formatting

    This is the core of the fullstack assessment!
    """

    # Step 1: Load all candidates
    candidates = load_candidates()

    # =============================================================================
    # Implementation of Filtering, Sorting, and Pagination
    # =============================================================================

    # 1. Filtering logic
    
    # Filter 1: Search filter (name, position, company)
    if search:
        search_lower = search.lower()
        candidates = [
            c for c in candidates
            if search_lower in c.get('name', '').lower() or
               search_lower in c.get('position', '').lower() or
               search_lower in c.get('company', '').lower()
        ]

    # Filter 2: Application type filter
    if application_type:
        # application_type is a list, we check if candidate's type is IN that list
        # Handle case insensitivity by converting candidate type to lower and checking against lowercased filter list
        app_types_lower = [t.lower() for t in application_type]
        candidates = [
            c for c in candidates
            if c.get('application_type', '').lower() in app_types_lower
        ]

    # Filter 3: Source filter
    if source:
        # source is a list
        source_lower = [s.lower() for s in source]
        candidates = [
            c for c in candidates
            if c.get('source', '').lower() in source_lower
        ]

    # Filter 4: Job ID filter
    if job_id:
        # job_id filter (exact match)
        candidates = [
            c for c in candidates 
            if str(c.get('job_id')) == str(job_id)
        ]

    # 2. Sorting logic
    
    # Sort by the specified field and order
    reverse_sort = (sort_order == 'desc')
    
    if sort_by == 'last_activity':
        # Default sort
        candidates = sorted(
            candidates,
            key=lambda x: x.get('last_activity', ''),
            reverse=reverse_sort
        )
    elif sort_by == 'name':
        candidates = sorted(
            candidates,
            key=lambda x: x.get('name', '').lower(),
            reverse=reverse_sort
        )
    
    # 3. Pagination logic
    
    # Calculate pagination indices and slice the data
    total = len(candidates)
    
    # Handle out-of-bounds or invalid page requests gracefully
    if page < 1:
        page = 1
        
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    # Slice the data
    paginated_candidates = candidates[start_idx:end_idx]
    
    # Calculate total pages
    if total > 0:
        total_pages = (total + per_page - 1) // per_page
    else:
        total_pages = 0
        
    # 4. Response formatting
    
    return {
        "candidates": paginated_candidates,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
