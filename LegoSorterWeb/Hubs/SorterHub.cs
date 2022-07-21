using Microsoft.AspNetCore.SignalR;

namespace LegoSorterWeb.Hubs
{
    public class SorterHub: Hub
    {
        public async Task SendMessage(long user, string message)
        {
            await Clients.All.SendAsync("messageReceived", user, message);
        }
    }
}
