import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ProductsContextProvider } from './context/products.context'
import { CategoriesContextProvider } from './context/categories.context'
import { AppLoader } from './components/AppLoader'


function App() {

  return (
    <main>
      <BrowserRouter>
        <ProductsContextProvider>
          <CategoriesContextProvider>
            <AppLoader />
          </CategoriesContextProvider>
        </ProductsContextProvider>
      </BrowserRouter>
    </main>
  )

}

export default App
