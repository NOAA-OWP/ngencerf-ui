# Using ngenCERF-UI Dockerfile

## Requirements

To build and run the ngenCERF-UI container, you will need the following software installed and running on your system:
- Docker
- ngenCERF-server, listening on port 8000
- PostgreSQL (recommend version 16), listening on port 5432

## Building ngenCERF-UI Container

To build the ngenCERF-UI container, execute the following command:
```
 docker build --tag=ngencerf-ui .
```
This will build the app for NodeJS's production mode.

## Running ngenCERF-UI Container

To run the ngenCERF-UI container, execute the following command:
```
docker run -it -p3000:3000 --add-host host.docker.internal:host-gateway -e NGENCERF_BASE_URL="http://host.docker.internal:8000" ngencerf-ui

```
This will give you an instance of the ngenCERF-UI application running on your system listening on local port 3000. Pressing Ctrl + C will shutdown the application.

If you would like to run in the NodeJS dev mode run:
```
docker run -it -p3000:3000 --add-host host.docker.internal:host-gateway -e NGENCERF_BASE_URL="http://host.docker.internal:8000" ngencerf-ui run dev
```

## Future Improvements 

- Docker compose project that launces all necessary containers simultaneously.

