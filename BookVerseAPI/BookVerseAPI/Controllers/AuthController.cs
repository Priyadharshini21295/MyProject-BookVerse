using BookVerseAPI.Data;
using BookVerseAPI.DTO;
using BookVerseAPI.Models;
using BookVerseAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;

namespace BookVerseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AppDbContext db, IPasswordHasher<AppUser> hasher, TokenService tokens) : ControllerBase
    {
        // POST /api/auth/register   (replaces: POST /users on json-server)
        [HttpPost("register")]
        public async Task<ActionResult<UserSummary>> Register(RegisterRequest req)
        {
            var normalized = req.Username.Trim().ToLowerInvariant();

            if (await db.Users.AnyAsync(u => u.NormalizedUsername == normalized))
                return Conflict(new { message = "Username already taken" });

            var user = new AppUser
            {
                Username = req.Username.Trim(),
                NormalizedUsername = normalized,
                Email = req.Email.Trim().ToLowerInvariant(),
                Gender = req.Gender,
                Phone = req.Phone,
                Role = "user",                                   // never taken from the request
                AddressJson = JsonSerializer.Serialize(req.Address ?? new List<string>()),
            };
            user.PasswordHash = hasher.HashPassword(user, req.Password);

            db.Users.Add(user);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Two sign-ups with the same username at the same moment: the unique index decides.
                return Conflict(new { message = "Username already taken" });
            }

            return Ok(new UserSummary(user.Id, user.Username, user.Email, user.Phone, user.Gender, user.Role));
        }

        // GET /api/auth/username-available?username=abc   (replaces: GET /users?username=abc in the Yup test)
        [HttpGet("username-available")]
        public async Task<IActionResult> UsernameAvailable([FromQuery] string username)
        {
            var normalized = (username ?? "").Trim().ToLowerInvariant();
            var taken = await db.Users.AnyAsync(u => u.NormalizedUsername == normalized);
            return Ok(new { available = !taken });
        }

        // POST /api/auth/login   (replaces: GET /users?username=..&password=.. — credentials no longer travel in the URL)
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
        {
            var normalized = req.Username.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.NormalizedUsername == normalized);

            // One message for "no such user" and "wrong password".
            var valid = user is not null &&
                hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password) != PasswordVerificationResult.Failed;

            if (!valid) return Unauthorized(new { message = "Username or Password is Incorrect" });

            return Ok(new LoginResponse(tokens.CreateToken(user!), user!.Username, user.Role));
        }
    }
}
