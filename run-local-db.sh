#!/bin/bash

docker \
  run \
  --rm -it \
  --detach \
  --env MYSQL_ROOT_PASSWORD=tplace \
  --env MYSQL_USER=tplace \
  --env MYSQL_PASSWORD=awesome \
  --env MYSQL_DATABASE=tplace \
  --name local_db \
  --publish 3306:3306 \
  mysql:5.5;