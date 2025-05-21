import { useEffect, useState } from "react"
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { db } from "./data/db"

//se renderiza el componente HEADER=  <Header />  (OBLIGATORIO PARA QUE SE MUESTRE)

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    //convierto de strin que lo hab[ia convertido] a nuevamente un arreglo
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  //console.log(data)
  //state de carrito
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  //se utiliza para que se almacene la infomración en el local storage, una vez
  //una vez haya modificaciones en el state del carrito
  useEffect(() => {
    //Permite que la información del carrito persista una vez se refresque la página web
    //pero solamente permite almacenamiento de STRINGS, por lo que toca pasar el cart o arreglo
    //a STRING
    localStorage.setItem('cart', JSON.stringify(cart))

  }, [cart])

  function addToCart(item) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)

    //ya existe en el carrito
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return
      //copia del carrito
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    }
    else {
      item.quantity = 1
      setCart([...cart, item])
    }

    //no toma parámetros porque lo está tomando del state carrito de compras
    saveLocalStorage()
  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id != id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item, //referencia del carrito de compras
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function clearCart() {
    setCart([])
  }



  return (
    <>


      <Header
        //via props en el header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />


      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (

            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />

          ))}

        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>


    </>
  )
}

export default App
