using System.ComponentModel.DataAnnotations;

namespace BookVerseAPI.DTO
{
    //public class AuthDtos
    //{
        // Same rules as the Yup schema in SignupPage.jsx, enforced again here because
        // client-side validation can always be bypassed. Length limits match AppDbContext.
        public static class SignupRules
        {
            public const string Password = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
            public const string Phone = @"^(\+91)?[6-9]\d{9}$";
        }

        // The React form also sends `role: "user"`. It is deliberately NOT a field here,
        // so it is ignored: public sign-ups are always regular users.
        public record RegisterRequest(
            [Required, StringLength(50, MinimumLength = 5, ErrorMessage = "Username should be 5 to 50 characters")] string Username,
            [Required, RegularExpression(SignupRules.Password, ErrorMessage = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character")] string Password,
            [Required, EmailAddress, StringLength(254)] string Email,
            [StringLength(10)] string? Gender,
            [Required, RegularExpression(SignupRules.Phone, ErrorMessage = "Please enter a valid mobile number")] string Phone,
            List<string>? Address);

        public record LoginRequest([Required] string Username, [Required] string Password);

        // Becomes localStorage "user" in the React app: { username, role, token }
        public record LoginResponse(string Token, string Username, string Role);

        public record UserSummary(int Id, string Username, string Email, string? Phone, string? Gender, string Role);

    }
//}
