FROM node:10.15.3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]
# FROM node:10.15.3

# LABEL maintainet="Roy Hershkovitz"

# ENV NODE_ENV=development
# ENV PORT=3000

# #COPY . /var/www
# WORKDIR /var/www


# RUN pwd
# RUN git clone https://github.com/royhersh/dayssince.git /var/www
# RUN pwd
# RUN ls -la
# RUN git checkout develop
# RUN npm install

# EXPOSE ${PORT}
# ENTRYPOINT ["npm", "start"]
# VOLUME ["/var/www"]