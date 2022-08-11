using LegoSorterWeb.Models;
using Microsoft.AspNetCore.SignalR;

namespace LegoSorterWeb.Hubs
{
    public class ControlHub : Hub
    {
        public async Task SendMessage(IEnumerable<Message> messages)
        //public async Task SendMessage(int ymin, int xmin, int ymax, int xmax, string label, float score)
        {
            await Clients.All.SendAsync("messageReceived", messages);
        }

        //public async Task Register(String test)
        ////public async Task SendMessage(int ymin, int xmin, int ymax, int xmax, string label, float score)
        //{
        //    await Clients.All.SendAsync("sendPong");
        //    //await Clients.All.SendAsync("getConfigs");
        //    //await Clients.All.SendAsync("config", "a","b");
        //    //await Clients.All.SendAsync("navigation", "analyzeFast");
        //    //await Clients.All.SendAsync("messageReceived", test);
        //}
        public async Task sendConfigs(Configs configs)
        {
            await Clients.All.SendAsync("sendConfigs", configs);
        }


        // Web browser sends to Phone to check if it is connected
        public async Task sendPing()
        {
            await Clients.All.SendAsync("sendPing");
        }
        // Phone sends to web browser to confirm that it is connected
        public async Task sendPong()
        {
            await Clients.All.SendAsync("sendPong");
        }
        // Phone sends to web browser to inform that it disconnects
        public async Task sendEndPong()
        {
            await Clients.All.SendAsync("sendEndPong");
        }

        public async Task setConfigs(Configs configs)
        {
            await Clients.All.SendAsync("setConfigs", configs);
        }

        public async Task sendConfigsConstraints(ConfigsConstraints configsConstraints)
        {
            await Clients.All.SendAsync("sendConfigsConstraints", configsConstraints);
        }

        public async Task getConfigsConstraints()
        {
            await Clients.All.SendAsync("getConfigsConstraints");
        }
        public async Task getConnectionConfigs()
        {
            await Clients.All.SendAsync("getConnectionConfigs");
        }
        public async Task sendConnectionConfigs(String savedAddr, String savedWebAddr)
        {
            await Clients.All.SendAsync("sendConnectionConfigs", savedAddr, savedWebAddr);
        }

        public async Task setConnectionConfigs(String savedAddr, String savedWebAddr)
        {
            await Clients.All.SendAsync("setConnectionConfigs", savedAddr, savedWebAddr);
        }

        public async Task getConfigs()
        //(String test)
        //public async Task SendMessage(int ymin, int xmin, int ymax, int xmax, string label, float score)
        {
            await Clients.All.SendAsync("getConfigs");
            //await Clients.All.SendAsync("getConfigs");
            //await Clients.All.SendAsync("config", "a","b");
            //await Clients.All.SendAsync("navigation", "analyzeFast");
            //await Clients.All.SendAsync("messageReceived", test);
        }

        public async Task sendAction(String action)
        {
            await Clients.All.SendAsync("action", "analyzeFast");
            //await Clients.All.SendAsync("getConfigs");
            //await Clients.All.SendAsync("config", "a","b");
            //await Clients.All.SendAsync("navigation", "analyzeFast");
            //await Clients.All.SendAsync("messageReceived", test);
        }

        public async Task navigation(String navigation)
        {
            await Clients.All.SendAsync("navigation", navigation);
            //await Clients.All.SendAsync("getConfigs");
            //await Clients.All.SendAsync("config", "a","b");
            //await Clients.All.SendAsync("navigation", "analyzeFast");
            //await Clients.All.SendAsync("messageReceived", test);
        }

        public async Task action(String action)
        {
            await Clients.All.SendAsync("action", action);
            //await Clients.All.SendAsync("getConfigs");
            //await Clients.All.SendAsync("config", "a","b");
            //await Clients.All.SendAsync("navigation", "analyzeFast");
            //await Clients.All.SendAsync("messageReceived", test);
        }
    }
}

