import { FiStar } from 'react-icons/fi';
import type { Product } from '../data/productData';
import '../Styles/Componentcss/ProductCard.css';

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const badgeClass = product.badge ? product.badge.toLowerCase().replace(/\s+/g, '-') : '';
  const isImage = product.image.startsWith('/') || product.image.includes('/') || product.image.startsWith('data:') || product.image.startsWith('http');

  return (
    <article className="product-card">
      {product.badge && <div className={`product-badge ${badgeClass}`}>{product.badge}</div>}
      <button type="button" className="product-image-button" onClick={onViewDetails} aria-label={`View ${product.name}`}>
        <div className="product-image">
          {isImage ? <img src={product.image} alt={product.name} loading="lazy" /> : <span aria-hidden="true">{product.image}</span>}
        </div>
      </button>
      <div className="product-info">
        <button type="button" className="product-name-button" onClick={onViewDetails}><h3>{product.name}</h3></button>
        <div className="rating" aria-label={`${product.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => <FiStar key={index} className={index < Math.floor(product.rating) ? 'filled' : ''} />)}
          <span>{product.rating} ({product.reviews} reviews)</span>
        </div>
        <div className="stock">In stock: {product.stock}</div>
        <div className="price">₦{product.price.toLocaleString()}</div>
        <div className="product-card-actions">
          <button type="button" onClick={onAddToCart} className="add-to-cart" disabled={product.stock <= 0}>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</button>
          <button type="button" onClick={onViewDetails} className="view-details-button">View Details</button>
        </div>
      </div>
    </article>
  );
}
