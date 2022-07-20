using System;
using System.Collections.Generic;

namespace LegoSorterWeb.Models
{
    public partial class Configuration
    {
        public string Option { get; set; } = null!;
        public string? Value { get; set; }
    }
}
