namespace BookVerseAPI.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Username { get; set; } = default!;
        public string NormalizedUsername { get; set; } = default!;   // lowercase, unique
        public string PasswordHash { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? Gender { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } = "user";                    // "user" | "admin"
        public string AddressJson { get; set; } = "[]";
    }
}
