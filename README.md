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