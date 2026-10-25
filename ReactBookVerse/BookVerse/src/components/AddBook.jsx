import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api, getErrorMessage } from "../api/http"

export const AddBook = () => {
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

    const myNavi = useNavigate();

    function handleChange(e) {
        setBook({
            ...book, [e.target.name]:
                e.target.name === 'bookId' || e.target.name === 'price' || e.target.name === 'stockCount' ?
                    Number(e.target.value) : e.target.value
        })
    }

    async function addNewBook(e) {
        e.preventDefault();

        try {
            // No more "GET to check for a duplicate, then POST": that check-then-insert had a
            // race. The API enforces a unique bookId and answers 409 if it already exists.
            await api.post('/books', book)
            alert('added successfully...')
            myNavi("/admin")
        }
        catch (error) {
            alert(getErrorMessage(error, "Could not add book"))
        }
    }

    return <>
        <h3 className="text-center">Add Book</h3>
        <div className="container w-50">
            <form action="" onSubmit={addNewBook}>
                <div className="form-group">
                    <input type="text" name="bookId" value={book.bookId} onChange={handleChange} placeholder="Book ID" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="bookName" value={book.bookName} onChange={handleChange} placeholder="Book Name" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="author" value={book.author} onChange={handleChange} placeholder="Book Author" className="form-control my-2" required />
                </div>
                <div className="form-group">
                    <input type="text" name="imgUrl" value={book.imgUrl} onChange={handleChange} placeholder="Book Image URL (optional)" className="form-control my-2" />
                </div>
                <div className="form-group">
                    {/* onChange added: without it this controlled <select> could never leave "fiction" */}
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
                <input type="submit" value="Add Book" />
            </form>
        </div>
    </>
}
