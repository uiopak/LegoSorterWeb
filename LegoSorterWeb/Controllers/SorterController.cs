using Grpc.Core;
using LegoSorterWeb.proto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LegoSorterWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorterController : ControllerBase
    {

        Channel channel;

        public SorterController(string address = "127.0.0.1:50052")
        {
            var channelOptions = new List<ChannelOption>();
            channelOptions.Add(new ChannelOption("grpc.max_receive_message_length", 16 * 1024 * 1024));
            this.channel = new Channel(address, ChannelCredentials.Insecure, channelOptions);
        }

        [HttpGet]
        public async Task<IActionResult> GetCameraPreview()
        {
            var client = new LegoControl.LegoControlClient(channel);
            //var res = client.GetCameraPreview(new Empty());
            var res = await client.GetCameraPreviewAsync(new Empty());
            var r = new FileContentResult(res.Image.ToByteArray(), "image/jpeg");
            r.FileDownloadName = $"{res.Timestamp}.jpeg";
            //channel.ShutdownAsync().Wait();
            return r;
        }

        [HttpPost]
        public async Task<IActionResult> SetChanel(string address)
        {
            channel.ShutdownAsync().Wait();
            var channelOptions = new List<ChannelOption>();
            channelOptions.Add(new ChannelOption("grpc.max_receive_message_length", 16 * 1024 * 1024));
            this.channel = new Channel(address, ChannelCredentials.Insecure, channelOptions);

            return NoContent();
        }
    }
}
