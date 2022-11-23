using LegoSorterWeb.Models;
using Microsoft.AspNetCore.SignalR;

namespace LegoSorterWeb.Hubs
{
    public class SorterHub : Hub
    {
        public async Task SendMessage(List<Message> messages)
        //public async Task SendMessage(int ymin, int xmin, int ymax, int xmax, string label, float score)
        {
            await Clients.All.SendAsync("messageReceived", messages);
        }
    }
}
