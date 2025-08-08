call npm run build:qa
copy Dockerfile dist/Dockerfile
copy nginx.qa.conf "dist/nginx.conf"
cd dist
docker build -t clima-laboral-frontend-img .
docker tag clima-laboral-frontend-img srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:latest
docker push srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:latest
