using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transmar.Api.Data.Models;

namespace Transmar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkstationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public WorkstationsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Alwstation>>> GetAll()
        {
            var items = await _db.Alwstations.OrderBy(w => w.Name).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Alwstation>> GetById(int id)
        {
            var item = await _db.Alwstations.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Alwstation>> Create(Alwstation input)
        {
            if (string.IsNullOrWhiteSpace(input.Name)) return BadRequest("Name is required.");
            if (string.IsNullOrWhiteSpace(input.ShortName)) return BadRequest("ShortName is required.");

            input.AlwstationId = 0;
            _db.Alwstations.Add(input);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = input.AlwstationId }, input);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Alwstation input)
        {
            if (id != input.AlwstationId) return BadRequest("ID mismatch.");

            var exists = await _db.Alwstations.AnyAsync(w => w.AlwstationId == id);
            if (!exists) return NotFound();

            _db.Entry(input).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Alwstations.FindAsync(id);
            if (item is null) return NotFound();

            var allocations = await _db.AlassLineWstationAllocations
                .Where(a => a.AlwstationId == id)
                .ToListAsync();

            if (allocations.Count > 0)
                _db.AlassLineWstationAllocations.RemoveRange(allocations);

            _db.Alwstations.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}