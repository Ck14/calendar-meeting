#!/bin/bash
# Logearse con buildah en srv-nexus
buildah login -u desadti -p Desadti.. srv-osnexus01.minfin.gob.gt:8006

# Generar versión usando timestamp (formato: YYYYMMDD-HHMMSS)
VERSION="qa-$(date +%Y%m%d-%H%M%S)"
COMMIT_ID=$(git rev-parse --short=8 HEAD)


# Ejecutar el comando de build de npm
npm run build:qa

# Copiar Dockerfile y nginx.conf al directorio dist
cp Dockerfile dist/Dockerfile
#cp nginx.qa.conf dist/nginx.conf

# Cambiar al directorio dist
cd dist

# Crear la imagen usando buildah
buildah --format=docker bud -t clima-laboral-frontend-img --add-host=srv-osnexus01.minfin.gob.gt:172.18.27.115 .

# Etiquetar la imagen con la versión y el commit SHA para rastreo en QA
buildah tag clima-laboral-frontend-img srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:${VERSION}
buildah push srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:${VERSION}

# Mantener "qa-latest" actualizado
buildah tag srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:${VERSION} srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:qa-latest
buildah push srv-osnexus01.minfin.gob.gt:8006/clima-laboral-frontend-img:qa-latest




