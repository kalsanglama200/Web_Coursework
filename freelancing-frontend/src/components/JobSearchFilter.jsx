import React, { useState, useEffect } from 'react';
import './JobSearchFilter.css';

const defaultFilters = {
  search: '',
  minBudget: '',
  maxBudget: '',
  role: '',
  status: '',
};

export default function JobSearchFilter({ jobs, onFilter }) {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    let filtered = jobs;
    // Search by title, description, or client name
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.description && job.description.toLowerCase().includes(q)) ||
        (job.clientName && job.clientName.toLowerCase().includes(q))
      );
    }
    // Filter by budget range
    if (filters.minBudget) {
      filtered = filtered.filter(job => Number(job.budget) >= Number(filters.minBudget));
    }
    if (filters.maxBudget) {
      filtered = filtered.filter(job => Number(job.budget) <= Number(filters.maxBudget));
    }
    // Filter by role
    if (filters.role) {
      filtered = filtered.filter(job => job.role === filters.role);
    }
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(job => job.status === filters.status);
    }
    onFilter(filtered);
  }, [filters, jobs, onFilter]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  return (
    <div className="job-search-filter">
      <input
        type="text"
        name="search"
        placeholder="Search by title, description, or client name"
        value={filters.search}
        onChange={handleChange}
      />
      <input
        type="number"
        name="minBudget"
        placeholder="Min Budget"
        value={filters.minBudget}
        onChange={handleChange}
        min="0"
      />
      <input
        type="number"
        name="maxBudget"
        placeholder="Max Budget"
        value={filters.maxBudget}
        onChange={handleChange}
        min="0"
      />
      <select name="role" value={filters.role} onChange={handleChange}>
        <option value="">All Roles</option>
        <option value="client">Client</option>
        <option value="freelancer">Freelancer</option>
      </select>
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="awarded">Awarded</option>
      </select>
      <button type="button" onClick={handleReset}>Reset</button>
    </div>
  );
} 