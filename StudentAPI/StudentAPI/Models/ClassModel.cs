using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAPI.Models
{
    public class ClassModel
    {
        public int Id { get; set; }
        [Required]
        public string CodeView { get; set; }
        public string Name { get; set; }
        public bool IsDelete { get; set; }
    }
}
