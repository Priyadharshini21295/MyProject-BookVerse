import { api } from "../api/http";
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CartContext } from "./CartProvider";


export const BookDetailsPage = ()=>{

    const [book, setBook] = useState({})
    const myNavi = useNavigate();

    const {id} = useParams()

    const getBook = async()=>{
        const res = await api.get(`/books/${id}`)
        setBook(res.data)
    };
    useEffect(()=>{   
        getBook()         
    }, [])

    const { addToCart } = useContext(CartContext);


    return <>
           <div className="container">
            <div className="row justify-content-center g-4">
                <div className="col-lg-3">
                    <img src={book.imgUrl} alt="" className="img-fluid rounded shadow"/>
                </div>
                <div className="col-lg-6">
                    <p>{book.category}</p>
                    <h2>{book.bookName}</h2>
                    <h5>Author : {book.author}</h5>
                    <h3>₹{book.price}</h3>
                    <p>{book.genre}</p>                  

                    <button  className="btn btn-primary" onClick={() => addToCart(book)} >Add to Cart</button>
                </div>
            </div>
        </div>

    </>
}