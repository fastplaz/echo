#!/bin/bash
echo FastPlaz - Run Container
echo
echo Sample Project: echo
echo   dir: /projects/echo
echo 
echo How to compile:
echo   $ cd /projects/echo/source/echo/
echo   $ ./clean.sh
echo   $ ./compile.sh
echo
echo Output File:
echo   /projects/echo/public_htm/echo.bin
echo

docker run -it -p 8080:80 echo bash
#docker run -it -v ~/shared-folder:/shared-folder -p 8080:80 fastplaz/$OS$RELEASE
