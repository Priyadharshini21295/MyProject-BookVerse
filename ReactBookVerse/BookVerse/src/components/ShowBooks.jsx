import { Link } from "react-router-dom"


export default function ShowBooks({ books, keyword, setKeyword, searchBook, deleteBook, filterByCategory,
  filterByGenre, fetchBooks
}){

    return <>
         <div className="container">
            <div className="w-25 ">
                <input type="text" name="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value) }/>
                <button onClick={searchBook} className="btn btn-secondary">Search book</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Author</th>
                        {/* <th>Image</th> */}
                        <th>Category</th>
                        <th>Genre</th>
                        <th>Price</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books.map(book => {
                            return <tr key={book.id}>
                                <td>{book.bookId}</td>
                                <td>{book.bookName}</td>
                                <td>{book.author}</td>
                                {/* <td>
                                    <img src={book.imgUrl} alt="" width={50} height={50}  />
                                </td> */}
                                {/* <td>{book.imgUrl}</td> */}
                                <td>{book.category}</td>
                                <td>{book.genre}</td>
                                <td>{book.price}</td>
                                <td>{book.stockCount}</td>
                                <td>                                    
                                    <Link to={`/admin/edit-book/${book.id}`} className="btn btn-info mx-3" >Edit</Link>
                                    <button onClick={()=> deleteBook(book.id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        })
                    }
                </tbody>

            </table>
            <Link to='add-book' className="btn btn-primary">Add Book</Link>
            <button onClick={() => filterByCategory('fiction')}>Fiction</button>
            <button onClick={() => filterByCategory('non-fiction')}>Non-Fiction</button>

            <button onClick={()=> filterByGenre('drama')}>Drama</button>
            <button onClick={fetchBooks}>Clear All Filter</button>
        </div>
    </>
}