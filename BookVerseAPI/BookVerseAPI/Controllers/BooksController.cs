using BookVerseAPI.Data;
using BookVerseAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookVerseAPI.DTO;

namespace BookVerseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController(AppDbContext db) : ControllerBase
    {
        // GET /api/books?search=&category=&genre=&page=&pageSize=
        // Always returns a plain array (what the React pages already expect). When page and
        // pageSize are given the list is paged, and X-Total-Count carries the full match count
        // (the same convention json-server uses).
        [HttpGet]
        public async Task<ActionResult<List<BookDto>>> GetAll(
            [FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? genre,
            [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var query = db.Books.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                var c = category.Trim().ToLowerInvariant();
                query = query.Where(b => b.Category == c);
            }
            if (!string.IsNullOrWhiteSpace(genre))
            {
                var g = genre.Trim().ToLowerInvariant();
                query = query.Where(b => b.Genre.ToLower().Contains(g));
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.Trim().ToLowerInvariant();
                query = query.Where(b => b.BookName.ToLower().Contains(q) || b.Author.ToLower().Contains(q));
            }

            Response.Headers["X-Total-Count"] = (await query.CountAsync()).ToString();

            query = query.OrderBy(b => b.Id);
            if (page.HasValue && pageSize.HasValue)
            {
                var size = Math.Clamp(pageSize.Value, 1, 100);
                var skip = (Math.Max(page.Value, 1) - 1) * size;
                query = query.Skip(skip).Take(size);
            }

            var books = await query.ToListAsync();
            return books.Select(ToDto).ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<BookDto>> GetById(int id)
        {
            var book = await db.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
            return book is null ? NotFound(new { message = "Book not found" }) : ToDto(book);
        }

        // ---- Admin only ------------------------------------------------------------

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<BookDto>> Create(BookRequest req)
        {
            if (await db.Books.AnyAsync(b => b.BookId == req.BookId))
                return Conflict(new { message = "Book already exists" });

            var book = new Book();
            Apply(book, req);
            db.Books.Add(book);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(new { message = "Book already exists" });
            }

            return CreatedAtAction(nameof(GetById), new { id = book.Id }, ToDto(book));
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<BookDto>> Update(int id, BookRequest req)
        {
            var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (book is null) return NotFound(new { message = "Book not found" });

            if (req.BookId != book.BookId && await db.Books.AnyAsync(b => b.BookId == req.BookId))
                return Conflict(new { message = "Another book already uses that Book ID" });

            Apply(book, req);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "This book changed while you were editing it (probably a new order). Reload and try again." });
            }

            return ToDto(book);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (book is null) return NotFound(new { message = "Book not found" });

            db.Books.Remove(book);     // past orders keep their own snapshot of name and price
            await db.SaveChangesAsync();
            return NoContent();
        }

        private static void Apply(Book book, BookRequest req)
        {
            book.BookId = req.BookId;
            book.BookName = req.BookName.Trim();
            book.Author = req.Author.Trim();
            book.ImgUrl = req.ImgUrl?.Trim() ?? "";
            book.Category = req.Category;
            book.Genre = req.Genre.Trim();
            book.Price = req.Price;
            book.StockCount = req.StockCount;
        }

        private static BookDto ToDto(Book b) =>
            new(b.Id, b.BookId, b.BookName, b.Author, b.ImgUrl, b.Category, b.Genre, b.Price, b.StockCount);
    }
}
