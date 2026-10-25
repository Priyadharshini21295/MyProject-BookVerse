using System.ComponentModel.DataAnnotations;

namespace BookVerseAPI.DTO
{
    //public class BookDtos
    //{
        // JSON is camelCase by default, so this serialises to exactly the shape
        // json-server returned: { id, bookId, bookName, author, imgUrl, category, genre, price, stockCount }
        public record BookDto(int Id, int BookId, string BookName, string Author, string ImgUrl,
            string Category, string Genre, decimal Price, int StockCount);

        // Used for POST and PUT. EditBook sends the whole book back (including `id`);
        // unknown properties like that are ignored. Length limits match AppDbContext.
        public record BookRequest(
            [Range(1, int.MaxValue, ErrorMessage = "Book ID must be a positive number")] int BookId,
            [Required, StringLength(200)] string BookName,
            [Required, StringLength(150)] string Author,
            [StringLength(500)] string? ImgUrl,
            [Required, RegularExpression("^(fiction|non-fiction)$", ErrorMessage = "Category must be 'fiction' or 'non-fiction'")] string Category,
            [Required, StringLength(100)] string Genre,
            [Range(0.01, 1000000, ErrorMessage = "Price must be greater than zero")] decimal Price,
            [Range(0, 100000, ErrorMessage = "Stock count can't be negative")] int StockCount);
    //}
}
