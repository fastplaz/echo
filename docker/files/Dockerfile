FROM fastplaz/ubuntu AS base

# Configuration
ARG GIT_REPO="https://github.com/fastplaz/echo.git"
ARG WEB_DIR="/projects/echo/public_html/"

# Make port 80 available to the world outside this container
EXPOSE 80
EXPOSE 443

# remove old template and pull source from echo repository
RUN rm -rf /projects/echo/
RUN git clone $GIT_REPO
RUN chmod -R 777 /projects/echo/public_html/ztemp/

# setup apache web dir
RUN mv /var/www/html /var/www/html-old
RUN ln -s $WEB_DIR /var/www/html

# Add file autu run
ADD files/echo-run.sh /app/run.sh
RUN chmod 755 /app/run.sh

