using BookVerseAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookVerseAPI.DTO;
using Microsoft.EntityFrameworkCore;

namespace BookVerseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(AppDbContext db) : ControllerBase
    {
        // GET /api/users  — password hashes are never part of the response.
        [HttpGet]
        public async Task<ActionResult<List<UserSummary>>> GetAll() =>
            await db.Users.AsNoTracking()
                .OrderBy(u => u.Id)
                .Select(u => new UserSummary(u.Id, u.Username, u.Email, u.Phone, u.Gender, u.Role))
                .ToListAsync();
    }
}
