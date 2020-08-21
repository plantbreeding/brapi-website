#!/bin/sh

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
  ps aux |grep nginx |grep -q -v grep
  PROCESS_1_STATUS=$?
  if [ $PROCESS_1_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit -1
  fi
  sleep 60
done