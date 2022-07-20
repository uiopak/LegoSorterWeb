using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using LegoSorterWeb.Models;

namespace LegoSorterWeb.Data
{
    public partial class LegoSorterWebContext : DbContext
    {
        public LegoSorterWebContext()
        {
        }

        public LegoSorterWebContext(DbContextOptions<LegoSorterWebContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Configuration> Configurations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.HasKey(e => e.Option);

                entity.ToTable("configuration");

                entity.Property(e => e.Option).HasColumnName("option");

                entity.Property(e => e.Value).HasColumnName("value");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
