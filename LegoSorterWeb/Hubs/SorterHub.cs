using LegoSorterWeb.Models;
using Microsoft.AspNetCore.SignalR;

namespace LegoSorterWeb.Hubs
{
    public class SorterHub : Hub
    {
        public async Task SendMessage(List<Message> messages)
        {
            await Clients.All.SendAsync("messageReceived", messages);
        }
        public async Task SendSortMessage(List<SortMessage> messages)
        {
            await Clients.All.SendAsync("sortMessageReceived", messages);
        }
        public async Task SendQueuesInfoMessage(QueuesInfoMessage message)
        {
            await Clients.All.SendAsync("queuesInfoMessageReceived", message);
        }

        public async Task RequestQueuesInfoMessage()
        {
            await Clients.All.SendAsync("requestQueuesInfoMessage");
        }
    }
}
