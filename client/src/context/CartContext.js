import React, { createContext, useState, useEffect } from 'react';

// Create the Context object
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load cart from LocalStorage (so it survives refresh)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to LocalStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Function 1: Add item to cart
    const addToCart = (product) => {
        // Check if item is already in cart
        const exist = cart.find((x) => x._id === product._id);
        
        if (exist) {
            // If it exists, increase quantity
            setCart(cart.map((x) => 
                x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
            ));
        } else {
            // If not, add it with quantity 1
            setCart([...cart, { ...product, qty: 1 }]);
        }
        alert(`${product.name} added to cart!`);
    };

    // Function 2: Remove item from cart
    const removeFromCart = (id) => {
        setCart(cart.filter((x) => x._id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};