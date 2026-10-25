using BookVerseAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookVerseAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<AppUser> Users {  get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        // Explicit lengths: MySQL needs bounded columns for indexes, and without them every
        // string becomes LONGTEXT. KEEP THESE IN SYNC with the [StringLength] limits in Dtos/ —
        // otherwise a too-long value gets past validation and fails as a 500 "Data too long".
        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Book>(e =>
            {
                e.HasIndex(x => x.BookId).IsUnique();
                e.Property(x => x.BookName).HasMaxLength(200);
                e.Property(x => x.Author).HasMaxLength(150);
                e.Property(x => x.ImgUrl).HasMaxLength(500);
                e.Property(x => x.Category).HasMaxLength(20);
                e.Property(x => x.Genre).HasMaxLength(100);
                e.Property(x => x.Price).HasPrecision(10, 2);          // decimal(10,2) in MySQL
            });

            b.Entity<AppUser>(e =>
            {
                e.HasIndex(x => x.NormalizedUsername).IsUnique();
                e.Property(x => x.Username).HasMaxLength(50);
                e.Property(x => x.NormalizedUsername).HasMaxLength(50);
                e.Property(x => x.PasswordHash).HasMaxLength(256);
                e.Property(x => x.Email).HasMaxLength(254);
                e.Property(x => x.Gender).HasMaxLength(10);
                e.Property(x => x.Phone).HasMaxLength(20);
                e.Property(x => x.Role).HasMaxLength(10);
            });

            b.Entity<Order>(e =>
            {
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Username).HasMaxLength(50);
                e.Property(x => x.Status).HasMaxLength(20);
                e.Property(x => x.Total).HasPrecision(10, 2);
            });

            b.Entity<OrderItem>(e =>
            {
                e.Property(x => x.BookName).HasMaxLength(200);
                e.Property(x => x.Price).HasPrecision(10, 2);
            });
        }
    }
}
