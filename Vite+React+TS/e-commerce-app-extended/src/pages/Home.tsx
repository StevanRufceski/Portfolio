import './Home.css'
import { useContext, useState } from 'react';
import { ProductsContext } from '../context/products.context';
import { CategoriesContext } from '../context/categories.context';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
    const {categories} = useContext(CategoriesContext);
    const {products} = useContext(ProductsContext);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <>
            <section className="promo">
                <h1>Welcome to e-commerce</h1>
                <p>The best place to buy stuff.
                    Find everything you need, all in one place.
                    Shop top-quality products at unbeatable prices.
                    Enjoy fast shipping and easy returns.
                    Trusted by thousands of happy customers.</p>
            </section>

            <div className="content">
                <aside className="sidebar">
                    <h2>Categories</h2>
                    <ul>
                        {categories.map((category, index) => (
                            <li
                                key={index}
                                className={selectedCategory === category ? 'active' : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                        <li
                            className={!selectedCategory ? 'active' : ''}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </li>
                    </ul>
                </aside>

                <section className="product-grid">
                    {selectedCategory ? (
                        products.filter(product => product.category === selectedCategory).map(product => (
                            <ProductCard key={product.id} product={product} />
                        )) 
                    ) : (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))                    )}
                </section>
            </div>
        </>
    );
};
