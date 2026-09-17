import { useEffect, useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../data/productData';
import '../Styles/Componentcss/ProductDetailModal.css';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Reset quantity whenever a different product is opened.
    setQuantity(1);
  }, [product.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="modal-close" onClick={onClose} aria-label="Close product details">
          <FiX />
        </button>

        <div className="modal-grid">
          <div className="modal-image">{product.image.startsWith('/') || product.image.includes('/') || product.image.startsWith('data:') || product.image.startsWith('http') ? <img src={product.image} alt={product.name} /> : <span>{product.image}</span>}</div>
          <div className="modal-info">
            <h2>{product.name}</h2>

            <div className="rating">
              {Array.from({ length: 5 }, (_, index) => (
                <FiStar key={index} className={index < Math.floor(product.rating) ? 'filled' : ''} />
              ))}
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="modal-desc">{product.description}</p>

            {product.specs && (
              <div className="specs">
                <h4>Specifications</h4>
                <ul>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="stock-status">Stock: {product.stock} available</div>
            <div className="price">₦{product.price.toLocaleString()}</div>

            <div className="quantity-selector">
              <button type="button" onClick={() => setQuantity(current => Math.max(1, current - 1))} disabled={product.stock <= 0 || quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(current => Math.min(product.stock, current + 1))} disabled={product.stock <= 0 || quantity >= product.stock}>+</button>
            </div>

            <button className="add-to-cart-modal" onClick={handleAddToCart} disabled={product.stock <= 0}>
              {product.stock > 0 ? `Add ${quantity} to Cart` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
