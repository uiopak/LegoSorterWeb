## How to run
1. Clone repository
2. Install .NET 7 SDK https://dotnet.microsoft.com/en-us/download/dotnet/7.0
3. Install node.js https://nodejs.org/en/download/
4. Install pnpm https://pnpm.io/installation

Best results installing with:
```commandline
npm install -g pnpm
```

5. Install node dependencies 
```commandline
cd LegoSorterWeb/
cd ClientApp/
pnpm install
```

6. Build 
```commandline
cd ..
dotnet publish -c Release
```

6. Run 
```commandline
dotnet published/LegoSorterWeb.dll
```

## How to run Docker
1. Clone repository
2. Build docker image

Run from repository root (directory containing README.md) 
```commandline
docker build -t lego_gui -f .\LegoSorterWeb\Dockerfile .
```
3. Create directory to save database
4. Copy database file to new directory
Copy `LegoSorterWeb\Database\LegoSorterWebDB.sqlite3` to new directory
5. Create container

Windows (PowerShell) example:
```commandline
docker run -d -p 5002:80 --restart unless-stopped --name lego_gui_sample `
 --mount type=bind,source=//g/LEGO/.net7test/db,destination=/app/Database lego_gui
```

6. If LegoSorterServer is running on different machine change ip here: http://ip:5002/config

### Optional information
Running without mount will work database will keep data between container restarts, but data will be lost after updating container:
```commandline
docker run -d -p 5002:80 --restart unless-stopped --name lego_gui_sample lego_gui
```
