import { useMemo, useState } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import { ProductCard } from '../Components/ProductCard';
import { CartDrawer } from '../Components/CartDrawer';
import { ProductDetailModal } from '../Components/ProductDetailModal';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/productData';
import { FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import '../Styles/Pagecss/Shop.css';

const categories = ['All', 'Microcontroller', 'Sensors', 'Actuators', 'Measurement', 'Electronics', 'Displays', 'Tools'] as const;
type SortOption = 'default' | 'price_asc' | 'price_desc' | 'top_rated';

export function Shop() {
  const { addToCart, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[number] | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price_asc') return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'top_rated') return [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="shop-page">
      <Sidebar />
      <main className="shop-main">
        <div className="shop-header">
          <div>
            <h1>Equipment Shop</h1>
            <p>Browse and purchase lab equipment &amp; components</p>
          </div>

          <div className="shop-actions">
            <div className="shop-search">
              <FiSearch aria-hidden="true" />
              <input type="search" placeholder="Search products..." value={searchTerm} onChange={event => setSearchTerm(event.target.value)} aria-label="Search products" />
              {searchTerm && <button type="button" onClick={clearSearch} aria-label="Clear search"><FiX /></button>}
            </div>
            <button type="button" className="cart-icon-btn" onClick={() => setIsCartOpen(true)} aria-label={`Open cart with ${totalItems} items`}>
              <FiShoppingCart />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>

        <div className="shop-filters">
          <div className="filter-categories" aria-label="Product categories">
            {categories.map(category => (
              <button key={category} type="button" className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="filter-sort">
            <label htmlFor="shop-sort">Sort by:</label>
            <select id="shop-sort" value={sortBy} onChange={event => setSortBy(event.target.value as SortOption)}>
              <option value="default">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="top_rated">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="shop-results-summary">
          <span>{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} found</span>
          {searchTerm && <span>for “{searchTerm}”</span>}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <h2>No products found</h2>
            <p>Try another search term or category.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Reset Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
                onAddToCart={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock })}
              />
            ))}
          </div>
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </main>
    </div>
  );
}
