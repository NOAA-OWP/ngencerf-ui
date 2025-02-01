# Using ngenCERF-UI Dockerfile

## Requirements

To build and run the ngenCERF-UI application, you will need the following software installed and running on your system:
- Docker Enginer
- Docker Compose 

You will need a file containing your NGWPC gitlab Personal Access Token (PAT) written at ~/.gitlab_token.

This Docker container pulls images from the NGWPC official Docker registry, so you will need to be logged into that registry. Using your gitlab credentials, login to the registry using the following command:
```
$ docker login registry.sh.nextgenwaterprediction.com
```

This will only start the ngenCERF UI application. If you need to connect to a backend server you will need to have that running at the address http://localhost:8000/.

## Running ngenCERF-UI Container

It is recommended to use the [ngencerf-docker](https://gitlab.sh.nextgenwaterprediction.com/NGWPC/nwm-ngen/ngencerf-docker/) project to run the full ngenCERF application stack at once. However if you would like to just run the frontend application in isolation, execute the following command:
```
docker compose up
```

This will give you an instance of the ngenCERF-UI application running on your system at the address http://localhost:3000/. Pressing Ctrl + C will shutdown the application. You can also issue the command:
```
docker compose down
```

## Troubleshooting

### Executing custom commands in a running container

If there is a need to connect to a container to issue commands from a terminal, perform the following steps:
1. Get a list of the running containers by executing the following command:
```
docker container ls
```
2. Attach a terminal to that container:
```
docker exec -it <container_id> bash
```
3. Execute any needed commands from that terminal.
4. Issue the following command to disconnect:
```
exit
```

## Future Improvements 

- Separate configuration to allow discrete production and development environments.

