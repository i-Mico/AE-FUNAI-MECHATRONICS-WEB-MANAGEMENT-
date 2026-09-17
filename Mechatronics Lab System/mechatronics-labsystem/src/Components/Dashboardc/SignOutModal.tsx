import { FiLogOut } from 'react-icons/fi';
import '../../Styles/Componentcss/SignOutModal.css';

interface SignOutModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userName: string;
  userRole: string;
}

export function SignOutModal({ isOpen, onCancel, onConfirm, userName, userRole }: SignOutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onCancel}>
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="signout-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-icon"><FiLogOut /></div>
          <h2 id="signout-title" className="modal-title">Sign Out?</h2>
          <p className="modal-subtitle">Are you sure you want to sign out?</p>
          <div className="modal-warning">
            <p>You are signed in as <strong>{userName}</strong> ({userRole}). You will need to sign in again to access your profile, make purchases, and interact with the system.</p>
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onCancel} className="btn-cancel">Cancel, Stay Signed In</button>
            <button type="button" onClick={onConfirm} className="btn-confirm">Yes, Sign Out</button>
          </div>
          <p className="modal-footer-note">You can still browse the shop and equipment catalog after signing out.</p>
        </div>
      </div>
    </div>
  );
}
