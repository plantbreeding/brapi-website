# Build with : docker build -t brapicoordinatorselby/brapi-web ./
# run with : docker run --name="brapi-web" -p 3000:3000 -d brapicoordinatorselby/brapi-web

FROM node:20.11

# Create app directory
WORKDIR /usr/src/app
# Install Dependancies (seperate Docker layer for speed)
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
# Copy App
COPY . .
EXPOSE 3000
# Run
CMD ["node", "./bin/www"]
