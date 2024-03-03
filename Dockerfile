# 可以從 Dockerhub Node 上選擇阪本：https://hub.docker.com/_/node/ 
FROM node:latest as Builder
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# npm ci 與 npm install 差別在於，ci 是使用 package-lock.json 上的版本，而 install 則是使用 package.json 上的版本來安裝，因此常導致安裝時其他套件的版本被提升上去了。
RUN npm ci --only=production

# Copy local code to the container image.

RUN npm run build
# Run the web service on container startup.
CMD [ "npm", "start" ]


# 使用 Multi-stage build 
# 當上面 build 完後，只拿取 Image 中  .next , public, node_modules, package.json  資料夾內的內容
# FROM node:latest as Prod
# WORKDIR /app

# COPY --from=Builder /app/.next ./.next
# COPY --from=Builder /app/public ./public
# COPY --from=Builder /app/node_modules ./node_modules
# COPY --from=Builder /app/package.json ./

# EXPOSE 3000
# ENV PORT 3000

# CMD ["npm", "start"]

# 使用 Multi-stage build  並且使用 standalone 方式優化
FROM node:latest as Prod
WORKDIR /app

COPY --from=Builder /app/public ./public
COPY --from=Builder /app/.next/standalone ./
COPY --from=Builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
