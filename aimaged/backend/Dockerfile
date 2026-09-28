FROM node:20-bookworm-slim

# Prisma engines need OpenSSL on Debian slim
RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]
