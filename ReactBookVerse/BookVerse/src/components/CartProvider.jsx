import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart")) || []
    );

    // Add to cart
    const addToCart = (book) => {
        const exists = cart.find((item) => item.id === book.id);

        let updatedCart;

        if (exists) {
            updatedCart = cart.map((item) =>
                item.id === book.id  // PS-1
                    ? item.qty < item.stockCount
                        ? { ...item, qty: item.qty + 1 }
                        : item
                    : item
            );
        } else {
            updatedCart = [...cart, { ...book, qty: 1 }];
        }

        setCart(updatedCart);
        alert('added successfully...')
    };

    // Increase quantity
    const increaseQty = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id
                ? item.qty < item.stockCount
                    ? { ...item, qty: item.qty + 1 }
                    : item
                : item
        );

        setCart(updatedCart);
    };

    // Decrease quantity
    const decreaseQty = (id) => {
        const updatedCart = cart
            .map((item) =>
                item.id === id
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
            .filter((item) => item.qty > 0);

        setCart(updatedCart);
    };

    // Remove item
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Total price
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );

    // Total cart items
    const totalItems = cart.reduce(
        (total, item) => total + item.qty,
        0
    );

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(localStorage);
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQty,
                decreaseQty,
                removeFromCart,
                clearCart,
                totalPrice,
                totalItems
            }}
        >
            {children}
        </CartContext.Provider>
    );
};