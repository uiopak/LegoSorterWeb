using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LegoSorterWeb.Data;
using LegoSorterWeb.Models;

namespace LegoSorterWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly LegoSorterWebContext _context;

        public ConfigurationController(LegoSorterWebContext context)
        {
            _context = context;
        }

        // GET: api/Configuration
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string?>>> GetConfigurations()
        {
          if (_context.Configurations == null)
          {
              return NotFound();
          }
            return await _context.Configurations.Select(c => $"{c.Option}:{c.Value}").ToListAsync();
        }

        // GET: api/Configuration/5
        [HttpGet("{id}")]
        public async Task<ActionResult<string>> GetConfiguration(string id)
        {
          if (_context.Configurations == null)
          {
              return NotFound();
          }
            var configuration = await _context.Configurations.FindAsync(id);


            if (configuration == null)
            {
                return NotFound();
            }

            return configuration.Value;
        }

        // PUT: api/Configuration/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConfiguration(string id, Configuration configuration)
        {
            if (id != configuration.Option)
            {
                return BadRequest();
            }

            _context.Entry(configuration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConfigurationExists(id))
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

        // POST: api/Configuration
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Configuration>> PostConfiguration(Configuration configuration)
        {
          if (_context.Configurations == null)
          {
              return Problem("Entity set 'LegoSorterWebContext.Configurations'  is null.");
          }
            _context.Configurations.Add(configuration);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ConfigurationExists(configuration.Option))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetConfiguration", new { id = configuration.Option }, configuration);
        }

        // DELETE: api/Configuration/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConfiguration(string id)
        {
            if (_context.Configurations == null)
            {
                return NotFound();
            }
            var configuration = await _context.Configurations.FindAsync(id);
            if (configuration == null)
            {
                return NotFound();
            }

            _context.Configurations.Remove(configuration);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConfigurationExists(string id)
        {
            return (_context.Configurations?.Any(e => e.Option == id)).GetValueOrDefault();
        }
    }
}
