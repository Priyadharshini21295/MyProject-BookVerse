import { useEffect, useState } from "react"
import { api, getErrorMessage } from "../api/http"

export const AdminOrders = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        api.get('/orders')
            .then((res) => setOrders(res.data))
            .catch((err) => alert(getErrorMessage(err, "Could not load orders")))
    }, [])

    return <>
        <h3 className="text-center">Orders</h3>
        <div className="container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>#{o.id}</td>
                            <td>{o.username}</td>
                            <td>{new Date(o.placedAt).toLocaleString()}</td>
                            <td>{o.purchasedItems.map((i) => `${i.qty} × ${i.bookName}`).join(", ")}</td>
                            <td>₹{o.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && <p className="text-muted text-center">No orders yet.</p>}
        </div>
    </>
}
