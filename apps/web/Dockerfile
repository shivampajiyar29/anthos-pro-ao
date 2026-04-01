FROM node:18-alpine

WORKDIR /app

# The build context is the root directory
COPY apps/web/package*.json ./
RUN npm install --legacy-peer-deps

COPY apps/web/ .

# We also need any shared packages if they are imported
# For now, Next.js usually bundles them if they are in the same workspace
# But we must ensure the pathing is correct

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
