#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
#RUN apt-get update
#RUN apt-get install -y curl
#RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
#RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
#RUN apt-get install -y nodejs
#RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7
WORKDIR /src
COPY ["LegoSorterWeb/LegoSorterWeb.csproj", "LegoSorterWeb/"]
RUN dotnet restore "LegoSorterWeb/LegoSorterWeb.csproj"
COPY . .
WORKDIR "/src/LegoSorterWeb"
RUN dotnet build "LegoSorterWeb.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LegoSorterWeb.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LegoSorterWeb.dll"]