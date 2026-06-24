import { useState, useEffect } from 'react';
import { api } from '../services/api';
import EmployeeForm from './EmployeeForm';

const formatPhoneNumber = (mobileNumber) => {
  if (!mobileNumber) return '';
  const countryCodes = ['91', '1', '44', '61', '49', '33', '81'];
  for (const code of countryCodes) {
    if (mobileNumber.startsWith(code) && mobileNumber.length === code.length + 10) {
      return `+${code} ${mobileNumber.slice(code.length)}`;
    }
  }
  return mobileNumber;
};

export default function Dashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isThemeLight, setIsThemeLight] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );

  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
  );

  const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  );

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  );

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );

  const OrgIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" x2="15" y1="9" y2="9"/><line x1="9" x2="15" y1="13" y2="13"/><line x1="9" x2="15" y1="17" y2="17"/><line x1="9" x2="9" y1="9" y2="17"/></svg>
  );

  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  );


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsThemeLight(true);
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isThemeLight) {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setIsThemeLight(false);
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setIsThemeLight(true);
    }
  };


  const fetchEmployees = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await api.employees.getAll(search);
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve employees list.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpenAddModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmit = async (formData) => {
    if (selectedEmployee) {
      const updated = await api.employees.update(selectedEmployee._id, formData);
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === selectedEmployee._id ? updated : emp))
      );
    } else {
      const created = await api.employees.create(formData);
      setEmployees((prev) => [created, ...prev]);
    }
    handleModalClose();
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      try {
        await api.employees.delete(employee._id);
        setEmployees((prev) => prev.filter((emp) => emp._id !== employee._id));
      } catch (err) {
        alert(err.message || 'Failed to delete employee.');
      }
    }
  };


  const totalEmployeesCount = employees.length;
  
  const departmentsCount = new Set(employees.map(emp => emp.department)).size;

  const getRecentJoinsCount = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return employees.filter(emp => new Date(emp.joiningDate) >= thirtyDaysAgo).length;
  };

  return (
    <div className="app-container">

      <header className="glass-panel">
        <div className="logo-container">
          <div className="logo-icon">SS</div>
          <span>StaffSphere</span>
        </div>
        <div className="nav-actions">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'none', md: 'inline' }}>
            Hello, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
          </span>
          
          <button className="btn-icon" onClick={toggleTheme} title="Toggle visual theme" aria-label="Toggle theme">
            {isThemeLight ? <MoonIcon /> : <SunIcon />}
          </button>
          
          <button className="btn btn-secondary" onClick={onLogout} title="Log Out session">
            <LogoutIcon />
            <span style={{ marginLeft: '2px' }}>Sign Out</span>
          </button>
        </div>
      </header>


      <main className="dashboard-content">
        

        <section className="stats-grid">
          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <UsersIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalEmployeesCount}</span>
              <span className="stat-label">Total Directory Staff</span>
            </div>
          </div>

          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
              <OrgIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{departmentsCount}</span>
              <span className="stat-label">Active Departments</span>
            </div>
          </div>

          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
              <CalendarIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{getRecentJoinsCount()}</span>
              <span className="stat-label">Joined Last 30 Days</span>
            </div>
          </div>
        </section>


        <section className="table-toolbar">
          <div className="search-wrapper">
            <span className="search-icon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="input-control search-input"
              placeholder="Search employee by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <PlusIcon />
            Add New Employee
          </button>
        </section>


        {error && (
          <div className="alert-banner alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}


        {loading && employees.length === 0 ? (
          <div className="loading-container glass-panel">
            <div className="spinner"></div>
            <span>Fetching staff directories...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="loading-container glass-panel" style={{ padding: '4rem 2rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No Employees Found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try refining your search term or add a new record to directory.</p>
          </div>
        ) : (
          <div className="table-container glass-panel">
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td data-label="Full Name">
                        <div className="employee-name-cell">
                          <span className="employee-name">{emp.fullName}</span>
                          <span className="employee-email">{emp.email}</span>
                        </div>
                      </td>
                      <td data-label="Mobile">{formatPhoneNumber(emp.mobileNumber)}</td>
                      <td data-label="Department">
                        <span className="badge badge-info">{emp.department}</span>
                      </td>
                      <td data-label="Designation">{emp.designation}</td>
                      <td data-label="Joining Date">
                        {new Date(emp.joiningDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'right' }}>
                        <div className="actions-cell">
                          <button
                            className="btn btn-icon"
                            onClick={() => handleOpenEditModal(emp)}
                            title="Edit records"
                            aria-label="Edit employee"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="btn btn-icon btn-danger"
                            onClick={() => handleDeleteEmployee(emp)}
                            title="Remove employee"
                            aria-label="Delete employee"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>


      {isModalOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
