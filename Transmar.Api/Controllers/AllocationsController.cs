using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transmar.Api.Data.Models;

namespace Transmar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AllocationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AllocationsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAllocations(
            [FromQuery] int? productId,
            [FromQuery] int? assemblyLineId)
        {
            var query = _db.AlassLineWstationAllocations
                .Include(a => a.AlassLine)
                    .ThenInclude(l => l.Product)
                .Include(a => a.Alwstation)
                .AsQueryable();

            if (productId.HasValue)
                query = query.Where(a => a.AlassLine.ProductId == productId.Value);

            if (assemblyLineId.HasValue)
                query = query.Where(a => a.AlassLineId == assemblyLineId.Value);

            var result = await query
                .OrderBy(a => a.AlassLineId)
                .ThenBy(a => a.Sort)
                .Select(a => new
                {
                    AllocationId = a.AlassLineWstationAllocationId,
                    ProductId = a.AlassLine.ProductId,
                    Product = a.AlassLine.Product.Name,
                    AssemblyLineId = a.AlassLineId,
                    AssemblyLine = a.AlassLine.Name,
                    Sort = a.Sort,
                    WorkstationId = a.AlwstationId,
                    WorkstationShortName = a.Alwstation.ShortName,
                    WorkstationName = a.Alwstation.Name
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost("allocate")]
        public async Task<IActionResult> Allocate([FromBody] AllocateRequest request)
        {
            if (request.AlassLineId <= 0) return BadRequest("AlassLineId is required.");
            if (request.AlwstationId <= 0) return BadRequest("AlwstationId is required.");

            var lineExists = await _db.AlassLines.AnyAsync(l => l.AlassLineId == request.AlassLineId);
            if (!lineExists) return BadRequest($"Assembly line {request.AlassLineId} does not exist.");

            var wsExists = await _db.Alwstations.AnyAsync(w => w.AlwstationId == request.AlwstationId);
            if (!wsExists) return BadRequest($"Workstation {request.AlwstationId} does not exist.");

            var already = await _db.AlassLineWstationAllocations.AnyAsync(a =>
                a.AlassLineId == request.AlassLineId && a.AlwstationId == request.AlwstationId);
            if (already) return Conflict("This workstation is already allocated to this assembly line.");

            var maxSort = await _db.AlassLineWstationAllocations
                .Where(a => a.AlassLineId == request.AlassLineId)
                .MaxAsync(a => (int?)a.Sort) ?? 0;

            var allocation = new AlassLineWstationAllocation
            {
                AlassLineId = request.AlassLineId,
                AlwstationId = request.AlwstationId,
                Sort = (short)(maxSort + 1)
            };

            _db.AlassLineWstationAllocations.Add(allocation);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                AllocationId = allocation.AlassLineWstationAllocationId,
                allocation.AlassLineId,
                allocation.AlwstationId,
                allocation.Sort
            });
        }

        [HttpDelete]
        public async Task<IActionResult> Remove([FromBody] List<int> ids)
        {
            if (ids is null || ids.Count == 0) return BadRequest("List of ids is required.");

            var items = await _db.AlassLineWstationAllocations
                .Where(a => ids.Contains(a.AlassLineWstationAllocationId))
                .ToListAsync();

            _db.AlassLineWstationAllocations.RemoveRange(items);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

    public class AllocateRequest
    {
        public int AlassLineId { get; set; }
        public int AlwstationId { get; set; }
    }
}