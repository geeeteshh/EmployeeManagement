import { useState, useEffect } from 'react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product Management',
  'Marketing',
  'Human Resources',
  'Sales',
  'Finance',
  'Operations',
];


const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'US/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
];

export default function EmployeeForm({ employee, onSubmit, onClose }) {
  const [employeeDetails, setEmployeeDetails] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    department: DEPARTMENTS[0],
    designation: '',
    joiningDate: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (employee) {
      const formattedDate = employee.joiningDate
        ? new Date(employee.joiningDate).toISOString().split('T')[0]
        : '';

      setEmployeeDetails({
        fullName: employee.fullName || '',
        email: employee.email || '',
        countryCode: employee.countryCode || '+91',
        mobileNumber: employee.mobileNumber || '',
        department: employee.department || DEPARTMENTS[0],
        designation: employee.designation || '',
        joiningDate: formattedDate,
      });
    }
  }, [employee]);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const validateForm = () => {
    const validationErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!employeeDetails.fullName.trim()) {
      validationErrors.fullName = 'Full name is required';
    }

    if (!employeeDetails.email) {
      validationErrors.email = 'Email is required';
    } else if (!emailRegex.test(employeeDetails.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!employeeDetails.mobileNumber) {
      validationErrors.mobileNumber = 'Mobile number is required';
    } else if (!phoneRegex.test(employeeDetails.mobileNumber)) {
      validationErrors.mobileNumber = 'Please enter a valid 10-digit number';
    }

    if (!employeeDetails.department) {
      validationErrors.department = 'Department selection is required';
    }

    if (!employeeDetails.designation.trim()) {
      validationErrors.designation = 'Designation is required';
    }

    if (!employeeDetails.joiningDate) {
      validationErrors.joiningDate = 'Joining date is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      await onSubmit(employeeDetails);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit form. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>{employee ? 'Edit Employee Details' : 'Add New Employee'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {submitError && (
          <div className="alert-banner alert-danger">
            {submitError && (
              <div className="alert-banner alert-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="input-control"
              value={employeeDetails.fullName}
              onChange={onFieldChange}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="formEmail">Email Address</label>
              <input
                type="email"
                id="formEmail"
                name="email"
                className="input-control"
                placeholder="john.doe@company.com"
                value={employeeDetails.email}
                onChange={onFieldChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <div className="phone-input-group">
                <select
                  className="country-code-select"
                  name="countryCode"
                  value={employeeDetails.countryCode}
                  onChange={onFieldChange}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.code}-${c.name}`} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  className="input-control"
                  placeholder="10-digit"
                  value={employeeDetails.mobileNumber}
                  onChange={onFieldChange}
                />
              </div>
              {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
            </div>

          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                className="input-control"
                value={employeeDetails.department}
                onChange={onFieldChange}
                style={{ appearance: 'none', background: 'var(--input-bg)' }}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                id="designation"
                name="designation"
                className="input-control"
                placeholder="e.g. Software Engineer"
                value={employeeDetails.designation}
                onChange={onFieldChange}
              />
              {errors.designation && <span className="error-text">{errors.designation}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="joiningDate">Joining Date</label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              className="input-control"
              value={employeeDetails.joiningDate}
              onChange={onFieldChange}
            />
            {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '100px' }}>
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', margin: '0' }}></div>
              ) : employee ? (
                'Save Changes'
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}