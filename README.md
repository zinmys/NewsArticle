## Compose News Article application

### React application with a Laravel backend and a MySQL database

Project structure:
```
.
├── back-end
│   ├── Dockerfile
│   ...
├── docker-compose.yaml
├── front-end
│   ├── ...
│   └── Dockerfile
└── README.md
```

[_docker-compose.yaml_](docker-compose.yaml)

The compose file defines an application with three services `front-end`, `back-end` and `mysql`.
When deploying the application, docker compose maps port 3000 of the frontend service container and port 8000 of the backend service container.
Make sure port 3000 and 8000 on the host is not already being in use.

## Deploy with docker compose

```
$ docker compose up -d

Cdocker compose up
Building 396.9s (9/12)
load build definition from Dockerfile                              
transferring dockerfile: 32B                                             
load .dockerignore                                                     
transferring context: 34B                                                      
load metadata for docker.io/library/node:18.4-alpine                   
FROM docker.io/library/node:18.4-alpine@sha256:7ae41699c38d8e50f5bf592867cf66136 
load build context                                                      
transferring context: 1.44MB                                                  
WORKDIR /app                                                           
COPY package.json ./                                                       
COPY package-lock.json ./                                                      
RUN npm ci --silent                                                             
RUN npm install react-scripts@5.0.1 -g --silent
```

## Expected result

Listing containers must show containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS         PORTS                               NAMES     
4be747d5c354   nginx:1.23.3-alpine     "/docker-entrypoint.…"   12 seconds ago   Up 7 seconds   0.0.0.0:8000->80/tcp                nginx     
692977fff3cf   newsarticle-front-end   "docker-entrypoint.s…"   13 seconds ago   Up 7 seconds   0.0.0.0:3000->3000/tcp              newsarticle-front-end-1
ac7cb7f9c42b   back-end                "docker-php-entrypoi…"   2 days ago       Up 31 hours    9000/tcp                            back-end  
7e7e1652b0c3   mysql:8.0               "docker-entrypoint.s…"   2 days ago       Up 31 hours    0.0.0.0:3306->3306/tcp, 33060/tcp   db-mysql
```

## Execute PHP command line
```
$ docker exec back-end php artisan migrate
$ docker exec back-end php artisan passport:client --client > then Enter to skip question (using default settings)
$ docker exec back-end php artisan passport:client --personal > then Enter to skip questions (using default settings)
```

## Copy secret and set as .env
```
PASSPORT_CREDENTIALS_CLIENT_ID={client credentials id}
PASSPORT_CREDENTIALS_CLIENT_SECRET={client credentials secret}

PASSPORT_PERSONAL_ACCESS_CLIENT_ID={personal credentials id}
PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET={personal credentials secret}
```

After the application starts, navigate to `http://localhost:3000` in your web browser.


The backend service container has the port 8000 mapped to 80 on the host.

Stop and remove the containers
```
$ docker compose down
Running 5/5
 - Container db-mysql                 Removed                                        
 - Container newsarticle-front-end-1  Removed                                           
 - Container nginx                    Removed                                          
 - Container back-end                 Removed                                           
 - Network newsarticle_news-article   Removed                                              
```