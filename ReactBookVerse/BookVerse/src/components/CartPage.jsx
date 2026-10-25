import { useContext } from "react";
import { CartContext } from "./CartProvider";
import { api, getErrorMessage } from "../api/http";


export const CartPage = () => {

    const { cart, clearCart, increaseQty, decreaseQty, removeFromCart, totalPrice } = useContext(CartContext);

    async function placeOrder() {
        try {
            // Only ids and quantities are sent. The server checks stock, decrements it, takes the
            // price from the database and the username from the JWT, all in one transaction.
            // (Before: the browser PUT a new stockCount for every book, then POSTed the order.)
            await api.post('/orders', {
                items: cart.map(({ id, qty }) => ({ id, qty }))
            })

            clearCart()
            alert("Order placed successfully");

        } catch (error) {
            // e.g. 'Only 2 copies of "Waves of Time" left'
            alert(getErrorMessage(error, "Could not place order"));
        }
    }

    return <>
        <div className="w-75 container">
            <table className="table table-striped ">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Sub total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cart.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.bookName}</td>
                                <td>₹{item.price}</td>
                                <td>
                                    <button onClick={() => decreaseQty(item.id)} className="mx-2">-</button>
                                    {item.qty}
                                    <button onClick={() => increaseQty(item.id)} className="mx-2">+</button>
                                    <button onClick={() => removeFromCart(item.id)} className="mx-3">Remove</button>
                                </td>
                                <td>{item.price * item.qty}</td>
                            </tr>
                        ))
                    }
                </tbody>

            </table>
            <h3 style={{ textAlign: "right" }}>Total : ₹{totalPrice}</h3>
            {
                cart.length > 0 && <button className="w-100 btn btn-info" onClick={placeOrder}>Place Order</button>
            }
        </div>

    </>
}
