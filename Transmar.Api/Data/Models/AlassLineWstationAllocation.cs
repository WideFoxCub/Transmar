using System;
using System.Collections.Generic;

namespace Transmar.Api.Data.Models;

public partial class AlassLineWstationAllocation
{
    public int AlassLineWstationAllocationId { get; set; }

    public int AlassLineId { get; set; }

    public int AlwstationId { get; set; }

    public short Sort { get; set; }

    public virtual AlassLine AlassLine { get; set; } = null!;

    public virtual Alwstation Alwstation { get; set; } = null!;
}