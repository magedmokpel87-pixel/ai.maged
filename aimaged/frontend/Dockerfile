FROM node:20-bookworm-slim AS builder
WORKDIR /app
# Public API address baked into the browser bundle; set at build time for real deployments
ARG NEXT_PUBLIC_API_BASE=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
