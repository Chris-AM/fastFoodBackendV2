<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Fast Food Backend Version 2

1. Clone Project (VIA SSH[SSH GUIDE](https://docs.github.com/es/authentication/connecting-to-github-with-ssh))
```
git@github.com:Chris-AM/fastFoodBackendV2.git
```
2. Install depencies (recomended [yarn](https://yarnpkg.com/getting-started))
```
yarn install || npm install
```
3. copy```.env.template``` and paste as```.env```

4. change env

5. start DB
```
docker-compose up -d
```

6. RUN SEED (JUST FOR DEV PORPUSES)
```
http://localhost:{port}/api/seed
```

7. GOTO ```public/static.zip``` and in root folder 
```
mkdir static/ && mkdir static/uploads
``` 
Then unzip ```static.zip``` there

8. Make sure images are at
```
static/uploads/{feature}_images/
```

9. Run API as dev (according to your package)
```
yarn || npm run start:dev
```