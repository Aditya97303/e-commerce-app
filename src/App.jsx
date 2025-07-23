import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const defaultProducts = [
    {
      id: 1,
      name: 'Laptop',
      price: 99999,
      category: 'Electronics',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Phone',
      price: 59999,
      category: 'Electronics',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Coffee Maker',
      price: 7999,
      category: 'Home',
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1509463531748-2d339bf273dc?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      name: 'Shoes',
      price: 12999,
      category: 'Fashion',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      name: 'Book',
      price: 499,
      category: 'Education',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('products'));
    if (saved && saved.length > 0) {
      setProducts(saved);
    } else {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === 'admin' && password === 'admin') {
      setUser({ username, isAdmin: true });
      setView('products');
    } else if (username && password) {
      setUser({ username, isAdmin: false });
      setView('products');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setView('login');
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found)
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const deleteProduct = (id) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== productToDelete));
    setProductToDelete(null);
  };

  const cancelDelete = () => setProductToDelete(null);

  return (
    <div className="app">
      <div className="header">
        <h1>My Store</h1>
        <div className="nav">
          {user && <button onClick={() => setView('products')}>Products</button>}
          {user && <button onClick={() => setView('cart')}>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</button>}
          {user?.isAdmin && <button onClick={() => setView('admin')}>Admin</button>}
          {user ? <button onClick={logout}>Logout ({user.username})</button> : null}
        </div>
      </div>

      {view === 'login' && (
        <form className="login" onSubmit={login}>
          <h2>Login</h2>
          <input name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button>Login</button>
          <p>Hint: admin/admin</p>
        </form>
      )}

      {view === 'products' && (
        <div className="products">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{new Intl.NumberFormat('en-IN').format(product.price)}</p>
              <p>Rating: {product.rating}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {view === 'cart' && (
        <div className="cart">
          <h2>Your Cart</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name} x {item.quantity}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'admin' && user?.isAdmin && (
        <div className="admin">
          <h2>Admin - Manage Products</h2>
          {products.map((p) => (
            <div className="admin-item" key={p.id}>
              <span>{p.name} - ₹{new Intl.NumberFormat('en-IN').format(p.price)}</span>
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {productToDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this product?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;