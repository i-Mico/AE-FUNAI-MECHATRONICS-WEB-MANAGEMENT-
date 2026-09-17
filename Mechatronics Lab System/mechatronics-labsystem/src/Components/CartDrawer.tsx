import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import '../Styles/Componentcss/CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={event => event.stopPropagation()} aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <h2>Shopping Cart</h2>
            <p>{totalItems} item{totalItems === 1 ? '' : 's'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close cart"><FiX /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <strong>Your cart is empty</strong>
              <p>Add products from the shop to see them here.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">{item.image.startsWith('/') || item.image.includes('/') || item.image.startsWith('data:') || item.image.startsWith('http') ? <img src={item.image} alt="" /> : <span>{item.image}</span>}</div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <div className="cart-item-price">N${item.price.toLocaleString()}</div>
                  <div className="cart-item-quantity">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name}`}>
                      <FiPlus />
                    </button>
                    <button type="button" className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">N${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="total"><span>Total</span><strong>N${totalPrice.toLocaleString()}</strong></div>
            <button type="button" className="checkout-btn" onClick={() => window.alert('Checkout is ready for the next payment-integration badge.')}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
