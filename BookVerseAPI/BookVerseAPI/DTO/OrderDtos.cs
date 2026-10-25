using System.ComponentModel.DataAnnotations;

namespace BookVerseAPI.DTO
{
    //public class OrderDtos
    //{
        // `id` is the book's primary key (the same `id` the cart already holds).
        // There is no price or username here on purpose: the server looks prices up in the
        // database and takes the username from the JWT, so neither can be forged by the client.
        public record OrderLineRequest([Range(1, int.MaxValue)] int Id, [Range(1, 100)] int Qty);

        public record PlaceOrderRequest([Required, MinLength(1, ErrorMessage = "Your cart is empty")] List<OrderLineRequest> Items);

        public record PurchasedItemDto(int Id, string BookName, decimal Price, int Qty);

        // purchasedItems keeps the name the old json-server order document used.
        public record OrderDto(int Id, string Username, DateTime PlacedAt, string Status, decimal Total,
            List<PurchasedItemDto> PurchasedItems);
    //}
}
