using System;
using System.Collections.Generic;

namespace Transmar.Api.Data.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public bool Active { get; set; }

    public virtual ICollection<AlassLine> AlassLines { get; set; } = new List<AlassLine>();
}