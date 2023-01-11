using Google.Protobuf;
using Grpc.Core;
using LegoSorterWeb.Data;
using LegoSorterWeb.proto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LegoSorterWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorterController : ControllerBase
    {
        string address;
        string port;
        Channel channel;

        private readonly LegoSorterWebContext _context;


        public SorterController(LegoSorterWebContext context)
        {
            _context = context;
            string address = "127.0.0.1";
            string port = "50051";
            if (_context.Configurations != null)
            {
                var db_address = _context.Configurations.Find("server_address");
                if (db_address != null&& db_address.Value!=null)
                {
                    address = db_address.Value;
                }
                var db_port = _context.Configurations.Find("server_grpc_port");
                if (db_port != null && db_port.Value != null)
                {
                    port = db_port.Value;
                }
            }
            this.address = address;
            this.port = port;
            var channelOptions = new List<ChannelOption>();
            channelOptions.Add(new ChannelOption("grpc.max_receive_message_length", 16 * 1024 * 1024));
            this.channel = new Channel($"{address}:{port}", ChannelCredentials.Insecure, channelOptions);
        }

        [HttpPost]
        public async Task<IActionResult> SendCameraImg(IFormFile file, [FromForm] string session = "", [FromForm] int rotation = 0)
        {
            
            var client = new LegoAnalysisFast.LegoAnalysisFastClient(channel);
            var img = new FastImageRequest();
            img.Session = session;
            img.Rotation = rotation;
            Stream stream = file.OpenReadStream();
            img.Image = await ByteString.FromStreamAsync(stream);
            client.DetectAndClassifyBricks(img);
            stream.Close();

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetCameraPreview()
        {
            var client = new LegoControl.LegoControlClient(channel);
            var res = await client.GetCameraPreviewAsync(new Empty());
            var r = new FileContentResult(res.Image.ToByteArray(), "image/jpeg");
            r.FileDownloadName = $"{res.Timestamp}.jpeg";
            return r;
        }

        [HttpPatch]
        public async Task<IActionResult> PatchChannel(string address, string port)
        {
            if (this.address != address || this.port != port)
            {
                channel.ShutdownAsync().Wait();
                var channelOptions = new List<ChannelOption>();
                channelOptions.Add(new ChannelOption("grpc.max_receive_message_length", 16 * 1024 * 1024));
                this.channel = new Channel($"{address}:{port}", ChannelCredentials.Insecure, channelOptions);
                this.address = address;
                this.port = port;
            }

            return NoContent();
        }
    }
}
