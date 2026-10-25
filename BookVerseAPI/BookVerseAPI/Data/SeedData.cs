using BookVerseAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace BookVerseAPI.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext db, IPasswordHasher<AppUser> hasher)
        {
            if (!db.Users.Any())
            {
                db.Users.AddRange(
                    MakeUser(hasher, "admin", "Admin@123", "admin@bookify.test", "admin"),
                    MakeUser(hasher, "reader", "Reader@123", "reader@bookify.test", "user"));
            }

            if (!db.Books.Any())
            {
                db.Books.AddRange(
                    MakeBook(101, "The Silent Reader", "A. Author", "fiction", "Drama", 349m, 12),
                    MakeBook(102, "Waves of Time", "B. Writer", "fiction", "Drama, Romance", 299m, 5),
                    MakeBook(103, "Quiet Streets", "C. Storyteller", "fiction", "Mystery", 399m, 8),
                    MakeBook(104, "Map of Dreams", "D. Novelist", "fiction", "Fantasy", 449m, 0),   // sold out: handy for testing the 409 path
                    MakeBook(105, "Practical Minimalism", "E. Thinker", "non-fiction", "Self-help", 279m, 20),
                    MakeBook(106, "A Short History of Trade", "F. Historian", "non-fiction", "History", 499m, 3));
            }

            db.SaveChanges();
        }

        private static Book MakeBook(int bookId, string name, string author, string category, string genre, decimal price, int stock) => new()
        {
            BookId = bookId,
            BookName = name,
            Author = author,
            Category = category,
            Genre = genre,
            Price = price,
            StockCount = stock,
            ImgUrl = $"https://picsum.photos/seed/book{bookId}/200/300",
        };

        private static AppUser MakeUser(IPasswordHasher<AppUser> hasher, string username, string password, string email, string role)
        {
            var user = new AppUser
            {
                Username = username,
                NormalizedUsername = username.ToLowerInvariant(),
                Email = email,
                Role = role,
            };
            user.PasswordHash = hasher.HashPassword(user, password);
            return user;
        }
    }
}
