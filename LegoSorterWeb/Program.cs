using LegoSorterWeb.Data;
using LegoSorterWeb.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<LegoSorterWebContext>
    (options => options.UseSqlite("Name=LegoSorterWebDB"));

builder.Services.AddSignalR();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("ClientPermission", policy =>
//    {
//        policy.AllowAnyHeader()
//            .AllowAnyMethod()
//            .WithOrigins("http://localhost:5002")
//            .AllowCredentials();
//    });
//});

var app = builder.Build();

//app.UseCors("ClientPermission");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.MapHub<SorterHub>("/hubs/sorter");

app.Run();


