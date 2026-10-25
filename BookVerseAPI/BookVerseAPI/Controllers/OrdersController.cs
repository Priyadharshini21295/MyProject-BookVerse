using BookVerseAPI.Data;
using BookVerseAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BookVerseAPI.DTO;

namespace BookVerseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(AppDbContext db) : ControllerBase
    {
        // POST /api/orders   body: { "items": [ { "id": 3, "qty": 2 } ] }
        // Replaces CartPage's loop of PUT /books/:id (stock edited from the browser) followed by
        // POST /orders. Stock check, stock decrement and the order itself are saved in ONE
        // SaveChanges, so they all succeed or none do.
        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<OrderDto>> Place(PlaceOrderRequest req)
        {
            var userId = int.Parse(User.FindFirstValue("sub")!);
            var username = User.FindFirstValue("name")!;

            // Merge duplicate lines before checking stock.
            var lines = req.Items
                .GroupBy(i => i.Id)
                .Select(g => (Id: g.Key, Qty: g.Sum(x => x.Qty)))
                .ToList();

            var ids = lines.Select(l => l.Id).ToList();
            var books = await db.Books.Where(b => ids.Contains(b.Id)).ToDictionaryAsync(b => b.Id);

            var order = new Order { UserId = userId, Username = username };

            foreach (var (id, qty) in lines)
            {
                if (!books.TryGetValue(id, out var book))
                    return NotFound(new { message = "A book in your cart no longer exists" });

                if (book.StockCount < qty)
                    return Conflict(new
                    {
                        message = book.StockCount == 0
                            ? $"\"{book.BookName}\" is out of stock"
                            : $"Only {book.StockCount} copies of \"{book.BookName}\" left"
                    });

                book.StockCount -= qty;

                order.Items.Add(new OrderItem
                {
                    BookRefId = book.Id,
                    BookName = book.BookName,
                    Price = book.Price,          // price comes from the database, never from the cart
                    Qty = qty,
                });
            }

            order.Total = order.Items.Sum(i => i.Price * i.Qty);
            db.Orders.Add(order);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "Stock changed while you were checking out. Please review your cart and try again." });
            }

            return CreatedAtAction(nameof(Mine), ToDto(order));
        }

        // GET /api/orders/mine
        [HttpGet("mine")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<List<OrderDto>>> Mine()
        {
            var userId = int.Parse(User.FindFirstValue("sub")!);

            var orders = await db.Orders.Include(o => o.Items).AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            return orders.Select(ToDto).ToList();
        }

        // GET /api/orders   (admin: every order, for the Orders page in the admin dashboard)
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<OrderDto>>> GetAll()
        {
            var orders = await db.Orders.Include(o => o.Items).AsNoTracking()
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            return orders.Select(ToDto).ToList();
        }

        private static OrderDto ToDto(Order o) => new(
            o.Id, o.Username,
            DateTime.SpecifyKind(o.PlacedAt, DateTimeKind.Utc),   // so the browser reads it as UTC, not local time
            o.Status, o.Total,
            o.Items.Select(i => new PurchasedItemDto(i.BookRefId, i.BookName, i.Price, i.Qty)).ToList());
    }
}
