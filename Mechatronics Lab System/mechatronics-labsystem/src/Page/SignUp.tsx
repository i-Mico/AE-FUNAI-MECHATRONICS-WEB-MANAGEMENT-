import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMail, FiCreditCard, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/Pagecss/Signup.css';
import heroImage from '../assets/images/Teo.png';

const levels = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level'];
const departments = ['Mechatronics Engineering'];

export function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [level, setLevel] = useState(levels[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [gmailAddress, setGmailAddress] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordRequirements = useMemo(() => ({
   minLength: password.length >= 8,
   uppercase: /[A-Z]/.test(password),
   lowercase: /[a-z]/.test(password),
   number: /\d/.test(password),
  }), [password]);

  const passwordStrength = useMemo(() => {
    const score = Object.values(passwordRequirements).filter(Boolean).length;

    if (!password) return { label: 'Password strength', width: 0 };
    if (score <= 1) return { label: 'Weak', width: 25 };
    if (score === 2) return { label: 'Fair', width: 50 };
    if (score === 3) return { label: 'Good', width: 75 };
    return { label: 'Strong', width: 100 };
  }, [password, passwordRequirements]);

  const passwordIsValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordIsValid) {
    const missingRequirements: string[] = [];

    if (!passwordRequirements.minLength) {
     missingRequirements.push('at least 8 characters');
    }

    if (!passwordRequirements.uppercase) {
     missingRequirements.push('one uppercase letter');
    }

    if (!passwordRequirements.lowercase) {
     missingRequirements.push('one lowercase letter');
    }

    if (!passwordRequirements.number) {
     missingRequirements.push('one number');
    }

    setError(`Your password is missing ${missingRequirements.join(', ')}.`);
   return;
  }

   if (password !== confirmPassword) {
   setError('Passwords do not match.');
   return;
  }

  setSubmitting(true);
    const result = await register({
      fullName,
      matricNumber,
      level,
      department,
      email: universityEmail || gmailAddress,
      gmailAddress,
      universityEmail,
      password,
   });
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Unable to create your account.');
      return;
    }

    setSuccess(result.message || 'Account created successfully.');
    window.setTimeout(() => navigate('/signin', { replace: true }), 900);
  };

  return (
    <div className="signup-page">
      <section className="signup-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(2, 34, 24, 0.1), rgba(2, 18, 13, 0.88)), url(${heroImage})` }}>
        <div className="signup-visual-copy">
          <div className="signup-brand"><span className="signup-brand-mark">M</span><span><strong>Mechatronics</strong><small>Lab Management System</small></span></div>
          <div className="signup-hero-copy">
            <p className="eyebrow">Student access</p>
            <h1>Join the lab.<br />Start building.</h1>
            <p>Create your student account to access equipment, courses, the shop, and collaborate with peers.</p>
            <div className="signup-stats"><div><strong>500+</strong><span>Students</span></div><div><strong>120+</strong><span>Equipment</span></div><div><strong>5</strong><span>Levels</span></div></div>
          </div>
        </div>
      </section>

      <section className="signup-form-panel">
        <div className="signup-form-wrap">
          <div className="signup-heading"><h2>Create Account</h2><p>Register as a student to access the lab system</p></div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label>Full Name<div className="input-with-icon"><FiUser /><input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Kwame Asante" required /></div></label>
            <label>Matric Number<div className="input-with-icon"><FiCreditCard /><input value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} placeholder="e.g. MCT/2022/001" required /></div></label>

            <div className="signup-two-col">
              <label>Level<select value={level} onChange={(e) => setLevel(e.target.value)}>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Department<select value={department} onChange={(e) => setDepartment(e.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>

            <label>Gmail Address<div className="input-with-icon"><FiMail /><input type="email" value={gmailAddress} onChange={(e) => setGmailAddress(e.target.value)} placeholder="you@gmail.com" required /></div></label>
            <label>University Email<div className="input-with-icon"><FiMail /><input type="email" value={universityEmail} onChange={(e) => setUniversityEmail(e.target.value)} placeholder="you@university.edu.ng" required /></div></label>

           <label>
            Password
            <div className="input-with-icon">
             <FiLock />
            <input
             type={showPassword ? 'text' : 'password'}
             value={password}
             onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
           placeholder="Create a password"
           minLength={8}
           required
           aria-invalid={password.length > 0 && !passwordIsValid}
         />
        <button
         type="button"
         className="field-icon-button"
         onClick={() => setShowPassword((value) => !value)}
         aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
        {showPassword ? <FiEyeOff /> : <FiEye />}
       </button>
      </div>
    </label>

    <div className="password-meter">
     <div className="password-meter-label">
      <span>{passwordStrength.label}</span>
     <strong>{password ? passwordStrength.label : ''}</strong>
    </div>
  <div className="password-meter-track">
      <span style={{ width: `${passwordStrength.width}%` }} />
    </div>
    </div>

<div className="password-requirements">
  <p className="password-requirements-title">Password requirements</p>

  <div className={`password-requirement ${passwordRequirements.minLength ? 'met' : 'unmet'}`}>
    <span className="password-requirement-icon">
      {passwordRequirements.minLength ? '✓' : '○'}
    </span>
    <span>At least 8 characters</span>
  </div>

  <div className={`password-requirement ${passwordRequirements.uppercase ? 'met' : 'unmet'}`}>
    <span className="password-requirement-icon">
      {passwordRequirements.uppercase ? '✓' : '○'}
    </span>
    <span>One uppercase letter</span>
  </div>

  <div className={`password-requirement ${passwordRequirements.lowercase ? 'met' : 'unmet'}`}>
    <span className="password-requirement-icon">
      {passwordRequirements.lowercase ? '✓' : '○'}
    </span>
    <span>One lowercase letter</span>
  </div>

  <div className={`password-requirement ${passwordRequirements.number ? 'met' : 'unmet'}`}>
    <span className="password-requirement-icon">
      {passwordRequirements.number ? '✓' : '○'}
    </span>
    <span>One number</span>
  </div>
</div>

            <label>Confirm Password<div className="input-with-icon"><FiLock /><input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required /><button type="button" className="field-icon-button" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>{showConfirm ? <FiEyeOff /> : <FiEye />}</button></div></label>

            {error && <p className="signup-message error">{error}</p>}
            {success && <p className="signup-message success">{success}</p>}

            <button type="submit" className="signup-submit" disabled={submitting}>{submitting ? 'Creating Account…' : 'Create Account'}</button>
          </form>

          <p className="signup-login">Already have an account? <Link to="/signin">Sign In</Link></p>
          <p className="signup-footer">Mechatronics Lab System © 2026</p>
        </div>
      </section>
    </div>
  );
}
