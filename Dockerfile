FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY vendor ./vendor
RUN npm ci --omit=dev
COPY server ./server
COPY web ./web
ENV NODE_ENV=production PORT=4173 DATA_DIR=/app/data
RUN mkdir /app/data && chown -R node:node /app
USER node
VOLUME ["/app/data"]
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:'+process.env.PORT+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server/index.mjs"]
