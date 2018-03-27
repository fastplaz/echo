#!/bin/bash
echo FastPlaz - Run Container
echo
echo

docker run -it -p 8080:80 echo
#docker run -it -v ~/shared-folder:/shared-folder -p 8080:80 fastplaz/$OS$RELEASE
