import { api, getErrorMessage } from "../api/http";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";


export const EditBook =()=>{
   const [book, setBook] = useState({
        bookId: 0,
        bookName: '',
        author: '',
        imgUrl: '',
        category: 'fiction',
        genre: '',
        price: '',
        stockCount: 0
    })

    const { id } = useParams() // {id:"whdshd"}

    const myNavi = useNavigate()

    async function getBook() {
        const res = await api.get(`/books/${id}`)
        setBook(res.data)
    }

    useEffect(() => {
        getBook();

    }, [])

    function handleChange(e) {
        setBook({
            ...book, [e.target.name]:
                e.target.name === 'bookId' || e.target.name === 'price' || e.target.name === 'stockCount' ?
                    Number(e.target.value) : e.target.value
        })
    }

    async function editBook(e) {
        e.preventDefault();

        try {

            const res = await api.put(`/books/${book.id}`, book)
            console.log(res.data);
            myNavi("/admin")
        }
        catch (error) { alert(getErrorMessage(error, "Could not update book")); }

    }
    return <>
        <h3 className="text-center">Edit Book</h3>
        <div className="container w-50">
            <form action="" onSubmit={editBook}>
                <div className="form-group">
                    <h4>{book.bookId}</h4>
                </div>
                <div className="form-group">
                    <input type="text" name="bookName" value={book.bookName} onChange={handleChange} placeholder="Book Name" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="author" value={book.author} onChange={handleChange} placeholder="Book Author" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="imgUrl" value={book.imgUrl} onChange={handleChange} placeholder="Book Image" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <select name="category" value={book.category} onChange={handleChange} className="form-select my-2">
                        <option value="fiction">Ficition</option>
                        <option value="non-fiction">Non-Ficition</option>
                    </select>
                </div>
                <div className="form-group">
                    <input type="text" name="genre" value={book.genre} onChange={handleChange} placeholder="Book Genre" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="price" value={book.price} onChange={handleChange} placeholder="Book price" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="number" name="stockCount" value={book.stockCount} onChange={handleChange} placeholder="Book count" className="form-control my-2" required />
                </div>
                <input type="submit" value="Update" />
            </form>
        </div>
    </>
}