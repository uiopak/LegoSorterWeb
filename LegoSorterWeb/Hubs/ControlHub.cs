using LegoSorterWeb.Models;
using Microsoft.AspNetCore.SignalR;

namespace LegoSorterWeb.Hubs
{
    public class ControlHub : Hub
    {
        public async Task SendMessage(IEnumerable<Message> messages)
        {
            await Clients.All.SendAsync("messageReceived", messages);
        }
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

        // Web browser asks Phone for its state
        public async Task getState()
        {
            await Clients.All.SendAsync("getState");
        }
        // Phone sends to web browser its state
        public async Task returnState(String state)
        {
            await Clients.All.SendAsync("returnState", state);
        }
        public async Task sendAnalysisEndPong()
        {
            await Clients.All.SendAsync("sendAnalysisEndPong");
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

        public async Task getSession()
        {
            await Clients.All.SendAsync("getSession");
        }

        public async Task sendSession(Boolean saveImgSwitchVal, String savedSession)
        {
            await Clients.All.SendAsync("sendSession", saveImgSwitchVal, savedSession);
        }

        public async Task setSession(Boolean saveImgSwitchVal, String savedSession)
        {
            await Clients.All.SendAsync("setSession", saveImgSwitchVal, savedSession);
        }

        public async Task getConfigs()
        {
            await Clients.All.SendAsync("getConfigs");
        }

        public async Task sendAction(String action)
        {
            await Clients.All.SendAsync("action", "analyzeFast");
        }

        public async Task navigation(String navigation)
        {
            await Clients.All.SendAsync("navigation", navigation);
        }

        public async Task action(String action)
        {
            await Clients.All.SendAsync("action", action);
        }
    }
}

