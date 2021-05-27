// Class for Database connections
// Also add to ConfigureServices() class in Startup.cs
using Microsoft.EntityFrameworkCore;

namespace TaskManager.Models
{
    public class DataContext : DbContext            // DbContext class has all the DB communication logic
    {
        /* 
            Run migrations every time something changes on the models

            - dotnet ef migrations add <someName>  (You can use any name for someName)
            - dotnet ef database update
        */

        // Constructor
        public DataContext(DbContextOptions<DataContext> conInfo) : base(conInfo)
        {

        }

        // which of your models should become tables inside the database
        public DbSet<Task> Tasks { get; set; }      // <Task> is the name of the Model/class.  Tasks is a reference/variable name for calling the Table in your code

    }
}