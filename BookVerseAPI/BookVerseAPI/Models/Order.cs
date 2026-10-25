namespace BookVerseAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = default!;
        public DateTime PlacedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Confirmed";
        public decimal Total { get; set; }
        public List<OrderItem> Items { get; set; } = [];
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }

        // Snapshot of the book at purchase time: later price edits or deleting
        // the book never rewrite order history.
        public int BookRefId { get; set; }
        public string BookName { get; set; } = default!;
        public decimal Price { get; set; }
        public int Qty { get; set; }
    }
}
