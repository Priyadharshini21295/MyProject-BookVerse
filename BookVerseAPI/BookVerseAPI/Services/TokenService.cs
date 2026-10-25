using BookVerseAPI.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace BookVerseAPI.Services
{
    public class TokenService(IConfiguration config)
    {
        public string CreateToken(AppUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new List<Claim>
            {
                new("sub", user.Id.ToString()),
                new("name", user.Username),
                new("role", user.Role),   // [Authorize(Roles = "admin")] reads this claim
            }),
                Issuer = config["Jwt:Issuer"],
                Audience = config["Jwt:Audience"],
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(config["Jwt:ExpiryMinutes"] ?? "60")),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
            };

            return new JsonWebTokenHandler().CreateToken(descriptor);
        }
    }
}
