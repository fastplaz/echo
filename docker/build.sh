#!/bin/bash
echo Echo - Docker

docker build -f files/Dockerfile -t echo .
