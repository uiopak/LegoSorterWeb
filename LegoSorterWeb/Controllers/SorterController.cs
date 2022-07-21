using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LegoSorterWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorterController : ControllerBase
    {
        [HttpGet]
        public string GetSorter()
        {
            return $"\"belt\"";
        }
    }
}
