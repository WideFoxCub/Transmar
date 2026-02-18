using System;
using System.Collections.Generic;

namespace Transmar.Api.Data.Models;

public partial class Alwstation
{
    public int AlwstationId { get; set; }

    public string Name { get; set; } = null!;

    public string ShortName { get; set; } = null!;

    public string? OpName { get; set; }

    public bool AutoStart { get; set; }

    public virtual ICollection<AlassLineWstationAllocation> AlassLineWstationAllocations { get; set; } = new List<AlassLineWstationAllocation>();
}