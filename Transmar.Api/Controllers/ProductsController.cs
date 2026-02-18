using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transmar.Api.Data.Models;

namespace Transmar.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var items = await _db.Products
                .OrderBy(p => p.Name)
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var item = await _db.Products.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Create(Product input)
        {
            if (string.IsNullOrWhiteSpace(input.Name))
                return BadRequest("Name is required.");

            input.ProductId = 0;
            _db.Products.Add(input);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = input.ProductId }, input);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Product input)
        {
            if (id != input.ProductId)
                return BadRequest("ID mismatch.");

            var exists = await _db.Products.AnyAsync(p => p.ProductId == id);
            if (!exists) return NotFound();

            _db.Entry(input).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product is null) return NotFound();

            await using var tx = await _db.Database.BeginTransactionAsync();

            var lineIds = await _db.AlassLines
                .Where(l => l.ProductId == id)
                .Select(l => l.AlassLineId)
                .ToListAsync();

            if (lineIds.Count > 0)
            {
                var allocations = await _db.AlassLineWstationAllocations
                    .Where(a => lineIds.Contains(a.AlassLineId))
                    .ToListAsync();

                if (allocations.Count > 0)
                    _db.AlassLineWstationAllocations.RemoveRange(allocations);

                var lines = await _db.AlassLines
                    .Where(l => l.ProductId == id)
                    .ToListAsync();

                if (lines.Count > 0)
                    _db.AlassLines.RemoveRange(lines);
            }

            _db.Products.Remove(product);

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return NoContent();
        }
    }
}