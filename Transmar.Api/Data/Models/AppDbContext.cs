using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Transmar.Api.Data.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AlassLine> AlassLines { get; set; }

    public virtual DbSet<AlassLineWstationAllocation> AlassLineWstationAllocations { get; set; }

    public virtual DbSet<Alwstation> Alwstations { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=ADAM\\SQLEXPRESS;Database=Transmar;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlassLine>(entity =>
        {
            entity.HasKey(e => e.AlassLineId).HasName("PK__ALAssLin__B833E37B2529AAFF");

            entity.ToTable("ALAssLine");

            entity.Property(e => e.AlassLineId).HasColumnName("ALAssLineID");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Status).HasDefaultValue((byte)1, "DF_ALAssLine_Status");

            entity.HasOne(d => d.Product).WithMany(p => p.AlassLines)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ALAssLine_Product");
        });

        modelBuilder.Entity<AlassLineWstationAllocation>(entity =>
        {
            entity.HasKey(e => e.AlassLineWstationAllocationId).HasName("PK__ALAssLin__8007256FA52EC713");

            entity.ToTable("ALAssLineWStationAllocation");

            entity.HasIndex(e => new { e.AlassLineId, e.Sort }, "UQ_Alloc_Line_Sort").IsUnique();

            entity.HasIndex(e => new { e.AlassLineId, e.AlwstationId }, "UQ_Alloc_Line_Station").IsUnique();

            entity.Property(e => e.AlassLineWstationAllocationId).HasColumnName("ALAssLineWStationAllocationID");
            entity.Property(e => e.AlassLineId).HasColumnName("ALAssLineID");
            entity.Property(e => e.AlwstationId).HasColumnName("ALWStationID");

            entity.HasOne(d => d.AlassLine).WithMany(p => p.AlassLineWstationAllocations)
                .HasForeignKey(d => d.AlassLineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Alloc_ALAssLine");

            entity.HasOne(d => d.Alwstation).WithMany(p => p.AlassLineWstationAllocations)
                .HasForeignKey(d => d.AlwstationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Alloc_ALWStation");
        });

        modelBuilder.Entity<Alwstation>(entity =>
        {
            entity.HasKey(e => e.AlwstationId).HasName("PK__ALWStati__5E5FCDC0D5ACB787");

            entity.ToTable("ALWStation");

            entity.Property(e => e.AlwstationId).HasColumnName("ALWStationID");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.OpName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.ShortName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6EDFB127080");

            entity.ToTable("Product");

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Active).HasDefaultValue(true, "DF_Product_Active");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
