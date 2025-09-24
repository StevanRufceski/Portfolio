import type { Product } from "../types/product.type";
import "./ProductCard.css";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = (props: ProductCardProps) => {
    return (
        <div className="product-card">
            <span className="product-category">{props.product.category}</span>
            <img src={props.product.image} alt={props.product.title} className="product-image" />
            <div>
                <div className="product-content">
                    <h3 className="product-title">{props.product.title}</h3>
                    <p className="product-description">{props.product.description}</p>
                </div>
                <div className="product-details">
                    <p className="product-rating">⭐ {props.product.rating.rate} ({props.product.rating.count} reviews)</p>
                    <p className="product-price">💰 ${props.product.price}</p>
                </div>
            </div>
        </div>
    );
};
