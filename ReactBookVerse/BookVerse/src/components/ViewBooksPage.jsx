import { useEffect, useState } from "react"
import ShowBooks from "./ShowBooks"
import { api, getErrorMessage } from "../api/http"


export const ViewBooksPage = () => {

    const [books, setBooks] = useState([])
    const [keyword, setKeyword] = useState("")
    const [filters, setFilters] = useState({ category: "", genre: "" })

    // Searching and filtering now happen on the API, so they COMBINE (category + genre +
    // search together) instead of stacking on whatever list happened to be on screen.
    async function loadBooks(search = keyword, f = filters) {
        const params = {}
        if (search) params.search = search
        if (f.category) params.category = f.category
        if (f.genre) params.genre = f.genre

        try {
            const res = await api.get('/books', { params })
            setBooks(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadBooks()
    }, [])

    function filterByCategory(category) {
        const next = { ...filters, category }
        setFilters(next)
        loadBooks(keyword, next)
    }

    function filterByGenre(genre) {
        const next = { ...filters, genre }
        setFilters(next)
        loadBooks(keyword, next)
    }

    function searchBook() {
        loadBooks(keyword, filters)
    }

    // Wired to ShowBooks' "Clear All Filter" button
    function clearFilters() {
        const cleared = { category: "", genre: "" }
        setKeyword("")
        setFilters(cleared)
        loadBooks("", cleared)
    }

    async function deleteBook(id) {
        try {
            await api.delete(`/books/${id}`);
            alert("Book deleted successfully");
            loadBooks()
        } catch (error) {
            alert(getErrorMessage(error, "Could not delete book"))
        }
    }

    return <>
        <h3 className="text-center">All Books</h3>

        <ShowBooks
            books={books}
            keyword={keyword}
            setKeyword={setKeyword}
            searchBook={searchBook}
            deleteBook={deleteBook}
            filterByCategory={filterByCategory}
            filterByGenre={filterByGenre}
            fetchBooks={clearFilters}
        />
    </>
}
