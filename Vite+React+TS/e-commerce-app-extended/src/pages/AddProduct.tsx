import "./AddProduct.css";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CategoriesContext } from "../context/categories.context";
import { ProductsContext } from "../context/products.context";

interface AddProductForm {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
    rate: number;
    count: number;
}

export const AddProduct = () => {
    const { categories } = useContext(CategoriesContext);
    const { addProduct } = useContext(ProductsContext);
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
    } = useForm<AddProductForm>({
        mode: "onChange",
    });

    const onSubmit = async (data: AddProductForm) => {
        try {
            const payload = {
                title: data.title,
                price: data.price,
                description: data.description,
                image: data.image,
                category: data.category,
            };

            const response = await axios.post("https://fakestoreapi.com/products", payload);

            const newProduct = {
                ...response.data,
                rating: {
                    rate: data.rate,
                    count: data.count,
                },
            };

            addProduct(newProduct);

            alert("Product successfully added!");
            reset();
            navigate("/");
        } catch (error) {
            console.error("Error submitting product:", error);
            alert("Failed to add product. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Add Product</h2>

            <label htmlFor="title">
                Title:
                <input
                    type="text"
                    {...register("title", { required: true, minLength: 3 })}
                />
                {errors.title && (
                    <div className="error">This field is required and must be at least 3 characters long</div>
                )}
            </label>

            <label htmlFor="description">
                Description:
                <textarea
                    rows={5}
                    {...register("description", {
                        required: true,
                        minLength: 10,
                        maxLength: 500,
                    })}
                />
                {errors.description && (
                    <div className="error">This field is required and must be between 10 and 500 characters</div>
                )}
            </label>

            <label htmlFor="category">
                Category:
                <select {...register("category", { required: true })}>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && <div className="error">Please select a category</div>}
            </label>

            <label htmlFor="image">
                Image URL:
                <input type="text" {...register("image", { required: true })} />
                {errors.image && <div className="error">This field is required</div>}
            </label>

            <label htmlFor="price">
                Price:
                <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true, min: 0 })}
                />
                {errors.price && (
                    <div className="error">This field is required and must be a positive number</div>
                )}
            </label>

            <label htmlFor="rate">
                Rating (Rate):
                <input
                    type="number"
                    step="0.1"
                    {...register("rate", { required: true, min: 1, max: 5 })}
                />
                {errors.rate && (
                    <div className="error">This field is required and must be between 1 and 5</div>
                )}
            </label>

            <label htmlFor="count">
                Rating (Count):
                <input
                    type="number"
                    {...register("count", { required: true, min: 0 })}
                />
                {errors.count && (
                    <div className="error">This field is required and must be a positive number</div>
                )}
            </label>

            <button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
        </form>
    );
};
