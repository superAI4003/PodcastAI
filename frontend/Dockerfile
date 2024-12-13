FROM node:20.15.1-alpine
# Set the working directory in the Docker container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to work directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

RUN npm install @next/swc-linux-x64-musl

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .


# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app using Node.js
CMD ["npm", "start"]