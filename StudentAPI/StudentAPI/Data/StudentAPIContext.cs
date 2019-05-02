using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;

namespace StudentAPI.Models
{
    public class StudentAPIContext : DbContext
    {
        public StudentAPIContext (DbContextOptions<StudentAPIContext> options)
            : base(options)
        {
        }

        public DbSet<StudentAPI.Models.StudentsModel> StudentsModel { get; set; }

        public DbSet<StudentAPI.Models.ClassModel> ClassModel { get; set; }
    }
}
