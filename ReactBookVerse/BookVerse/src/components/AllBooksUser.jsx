import { api } from "../api/http"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MyContext } from "../App"



export const AllBooksUser =()=>{

    const [books, setBooks] = useState([])
    const { loggedUser, setLoggedUser } = useContext(MyContext)
    const myNavi = useNavigate()


    async function fetchBooks() {
        const res = await api.get('/books')
        setBooks(res.data);        
    }

    useEffect(()=>{
        
        fetchBooks()
    },[])

    return <>
        <h3>hello {loggedUser.username}</h3>
        <div className="container-fluid row g-2">
            {
                books.map((book)=>{
                    return <div className="col-lg-3 col-md-6 " key={book.id}>
                        <div className="card w-75">
                            <img src={book.imgUrl} className="card-img-top" />
                            <div className="card-body">
                                <h4 className="card-title">{book.bookName}</h4>
                                <h5 className="card-title">₹{book.price}</h5>
                                <p className="card-text">{book.genre}</p>
                                <Link to={`/user/view/${book.id}`} className="btn btn-primary">Read more</Link>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>

    </>
}