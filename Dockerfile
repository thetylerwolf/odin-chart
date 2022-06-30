FROM node:10.15.3-jessie
WORKDIR /app
COPY package*.json /app

# RUN apt-get update -y
# RUN apt-get install apt-transport-https -y
# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# RUN apt update -y
# RUN apt install yarn -y
# RUN yarn
RUN npm install

COPY . /app

# RUN yarn build
RUN npm run build

EXPOSE 1337

# CMD ["yarn", "server"]
CMD ["npm", "run", "server"]