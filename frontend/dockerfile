# Base image
FROM node:22

# Install OpenSSL
RUN apt-get update -y
RUN apt-get install -y openssl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm uninstall bcrypt
RUN npm install bcrypt

# Copy the rest of the application code
COPY . .

# Prisma generate
RUN npx prisma generate

# Build the TypeScript code if necessary
RUN npm run build

# Expose the API Gateway port
EXPOSE 3000

# Run the API Gateway
CMD ["npm", "run", "dev"]