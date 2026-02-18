using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transmar.Api.Data.Models;

namespace Transmar.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/assemblylines")]
    public class AssemblyLinesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AssemblyLinesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? productId)
        {
            var q = _db.AlassLines.AsQueryable();

            if (productId.HasValue)
                q = q.Where(l => l.ProductId == productId.Value);

            var items = await q
                .OrderBy(l => l.Name)
                .Select(l => new AssemblyLineDto
                {
                    AlassLineId = l.AlassLineId,
                    ProductId = l.ProductId,
                    Name = l.Name,
                    Status = l.Status
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var l = await _db.AlassLines.FindAsync(id);
            if (l is null) return NotFound();

            return Ok(new AssemblyLineDto
            {
                AlassLineId = l.AlassLineId,
                ProductId = l.ProductId,
                Name = l.Name,
                Status = l.Status
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssemblyLineCreateUpdateDto input)
        {
            if (input.ProductId <= 0) return BadRequest("ProductId is required.");
            if (string.IsNullOrWhiteSpace(input.Name)) return BadRequest("Name is required.");

            var productExists = await _db.Products.AnyAsync(p => p.ProductId == input.ProductId);
            if (!productExists) return BadRequest($"Product {input.ProductId} does not exist.");

            var entity = new AlassLine
            {
                ProductId = input.ProductId,
                Name = input.Name.Trim(),
                Status = input.Status
            };

            _db.AlassLines.Add(entity);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = entity.AlassLineId }, new AssemblyLineDto
            {
                AlassLineId = entity.AlassLineId,
                ProductId = entity.ProductId,
                Name = entity.Name,
                Status = entity.Status
            });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssemblyLineCreateUpdateDto input)
        {
            if (id <= 0) return BadRequest("Invalid id.");
            if (input.ProductId <= 0) return BadRequest("ProductId is required.");
            if (string.IsNullOrWhiteSpace(input.Name)) return BadRequest("Name is required.");

            var entity = await _db.AlassLines.FindAsync(id);
            if (entity is null) return NotFound();

            var productExists = await _db.Products.AnyAsync(p => p.ProductId == input.ProductId);
            if (!productExists) return BadRequest($"Product {input.ProductId} does not exist.");

            entity.ProductId = input.ProductId;
            entity.Name = input.Name.Trim();
            entity.Status = input.Status;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.AlassLines.FindAsync(id);
            if (item is null) return NotFound();

            _db.AlassLines.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public class AssemblyLineDto
    {
        public int AlassLineId { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = "";
        public byte Status { get; set; }
    }

    public class AssemblyLineCreateUpdateDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = "";
        public byte Status { get; set; }
    }
}
