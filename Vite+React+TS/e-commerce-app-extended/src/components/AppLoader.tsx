import { useContext } from 'react'
import { Navigation } from './Navigation'
import { ProductsContext } from '../context/products.context';
import { CategoriesContext } from '../context/categories.context';
import { Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Products } from '../pages/Products'
import { AddProduct } from '../pages/AddProduct'

export function AppLoader() {
  const { isLoading: productsLoading, error: productsError } = useContext(ProductsContext)
  const { isLoading: categoriesLoading, error: categoriesError } = useContext(CategoriesContext)

  if (productsLoading || categoriesLoading) {
    return <h4>Loading...</h4>
  }

  if (productsError || categoriesError) {
    return (
      <h2 style={{ color: 'red' }}>
        {productsError || categoriesError}
      </h2>
    )
  }

  return (
    <>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/add-product' element={<AddProduct />} />
      </Routes>
    </>
  )
}
