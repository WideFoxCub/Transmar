using System;
using System.Collections.Generic;

namespace Transmar.Api.Data.Models;

public partial class AlassLine
{
    public int AlassLineId { get; set; }

    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public byte Status { get; set; }

    public virtual ICollection<AlassLineWstationAllocation> AlassLineWstationAllocations { get; set; } = new List<AlassLineWstationAllocation>();

    public virtual Product Product { get; set; } = null!;
}