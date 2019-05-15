using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly StudentAPIContext _context;

        public StudentsController(StudentAPIContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentsModel>>> GetStudentsModel(
            bool isDelete,
            int a ,
            string searchName,
            string searchAdd,
            string searchDay)
        { 
            if (a == 1) // nhung sinh vien hoat dong hoac khong
            {
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchAdd) && !String.IsNullOrEmpty(searchDay))
                {
                    return await _context.StudentsModel.Where(x => x.Name.Contains(searchName) 
                    && x.Address.Contains(searchAdd) 
                    && x.BirthDay == DateTime.Parse(searchDay)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchAdd))
                {
                    return await _context.StudentsModel.Where(x => x.Name.Contains(searchName)
                    && x.Address.Contains(searchAdd)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchDay))
                {
                    return await _context.StudentsModel.Where(x => x.Name.Contains(searchName)
                    && x.BirthDay == DateTime.Parse(searchDay)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if ( !String.IsNullOrEmpty(searchAdd) && !String.IsNullOrEmpty(searchDay))
                {
                    return await _context.StudentsModel.Where(x => x.Address.Contains(searchAdd)
                    && x.BirthDay == DateTime.Parse(searchDay)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName))
                {
                    return await _context.StudentsModel.Where(x => x.Name.Contains(searchName)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchAdd))
                {
                    return await _context.StudentsModel.Where(x => x.Address.Contains(searchAdd)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchDay))
                {
                    return await _context.StudentsModel.Where(x => x.BirthDay == DateTime.Parse(searchDay)
                    && x.IsDelete == isDelete)
                    .ToListAsync();
                }
                return await _context.StudentsModel.Where(x => x.IsDelete == isDelete)
                .ToListAsync();

            }
            if(a == 2) // tat ca sinh vien
            {
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchAdd) && !String.IsNullOrEmpty(searchDay)) //if has 3 para
                {
                    return await _context.StudentsModel.Where(s => s.Name.Contains(searchName) 
                    && s.Address.Contains(searchAdd) 
                    && s.BirthDay == DateTime.Parse(searchDay)).ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchAdd)) //if has 3 para
                {
                    return await _context.StudentsModel.Where(s => s.Name.Contains(searchName)
                    && s.Address.Contains(searchAdd))
                    .ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchAdd) && !String.IsNullOrEmpty(searchDay)) //if has 3 para
                {
                    return await _context.StudentsModel.Where(s => s.Address.Contains(searchAdd)
                    && s.BirthDay == DateTime.Parse(searchDay)).ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName) && !String.IsNullOrEmpty(searchDay)) //if has 3 para
                {
                    return await _context.StudentsModel.Where(s => s.Name.Contains(searchName)
                    && s.BirthDay == DateTime.Parse(searchDay)).ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchName)) {
                    return await _context.StudentsModel.Where(s => s.Name.Contains(searchName)).ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchAdd))
                {
                    return await _context.StudentsModel.Where(s => s.Address.Contains(searchAdd)).ToListAsync();
                }
                if (!String.IsNullOrEmpty(searchDay))
                {
                    return await _context.StudentsModel.Where(s => s.BirthDay == DateTime.Parse(searchDay)).ToListAsync();
                }

                return await _context.StudentsModel.ToListAsync();

            }
            return await _context.StudentsModel.ToListAsync();
            
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentsModel>> GetStudentsModel(int id)
        {
            var studentsModel = await _context.StudentsModel.FindAsync(id);

            if (studentsModel == null)
            {
                return NotFound();
            }
            

            return studentsModel;
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudentsModel(int id, StudentsModel studentsModel)
        {
            if (id != studentsModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(studentsModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentsModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Students
        [HttpPost]
        public async Task<ActionResult<StudentsModel>> PostStudentsModel(StudentsModel studentsModel)
        {
            _context.StudentsModel.Add(studentsModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudentsModel", new { id = studentsModel.Id }, studentsModel);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StudentsModel>> DeleteStudentsModel(int id)
        {
            var studentsModel = await _context.StudentsModel.FindAsync(id);
            if (studentsModel == null)
            {
                return NotFound();
            }

            _context.StudentsModel.Remove(studentsModel);
            await _context.SaveChangesAsync();

            return studentsModel;
        }

        private bool StudentsModelExists(int id)
        {
            return _context.StudentsModel.Any(e => e.Id == id);
        }
    }
}
