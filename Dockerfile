# Use Puppeteer-ready image
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /usr/src/app

# Switch to root user to install pnpm
USER root

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm --unsafe-perm && pnpm install

# Install the required browser
RUN npx puppeteer browsers install chrome

COPY . .

EXPOSE 3000
CMD ["pnpm", "start"]
