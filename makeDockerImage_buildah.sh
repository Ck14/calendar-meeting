#!/bin/bash

# Logearse con buildah en srv-nexus
buildah login -u desadti -p Desadti.. srv-osnexus01.minfin.gob.gt:8006

# Ejecutar el comando de build de npm
npm run build:qa

# Copiar Dockerfile y nginx.conf al directorio dist
cp Dockerfile dist/Dockerfile
#cp nginx.qa.conf dist/nginx.conf

# Cambiar al directorio dist
cd dist

# Crear la imagen usando buildah
buildah --format=docker bud -t clima-laboral-frontend-img --add-host=srv-osnexus01.minfin.gob.gt:172.18.27.115 .

# Etiquetar la imagen
buildah tag clima-laboral-frontend-img srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:latest

# Subir la imagen al repositorio
buildah push srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:latest
