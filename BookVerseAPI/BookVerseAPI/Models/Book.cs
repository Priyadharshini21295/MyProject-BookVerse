using System.ComponentModel.DataAnnotations;

namespace BookVerseAPI.Models
{
    public class Book
    {
        // Primary key. This is the `id` json-server generated, and what the React app
        // uses in routes (/user/view/:id, /admin/edit-book/:id) and as the cart key.
        public int Id { get; set; }

        // The catalogue number the admin types in AddBook. Unique.
        public int BookId { get; set; }

        public string BookName { get; set; } = default!;
        public string Author { get; set; } = default!;
        public string ImgUrl { get; set; } = "";
        public string Category { get; set; } = "fiction";    // "fiction" | "non-fiction"
        public string Genre { get; set; } = default!;
        public decimal Price { get; set; }

        // Concurrency token: if two orders (or an order and an admin edit) touch the
        // same row at once, the second UPDATE affects 0 rows and EF throws
        // DbUpdateConcurrencyException instead of silently overselling.
        [ConcurrencyCheck]
        public int StockCount { get; set; }
    }
}
