#!/bin/sh

echo "Starting the php process"
php-fpm -D
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start php-fpm: $status"
  exit $status
fi

echo "Load Nginx config"
while /bin/true; do
  sleep 6h
  nginx -s reload
done &

echo "Starting the Nginx process"
nginx -g "daemon off;" &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start nginx: $status"
  exit $status
fi

while /bin/true; do
  ps aux |grep php-fpm |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep nginx |grep -q -v grep
  PROCESS_2_STATUS=$?
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit -1
  fi
  sleep 60
done