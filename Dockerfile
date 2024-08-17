FROM node:20-alpine AS sk-build
WORKDIR /usr/src/app

ARG TZ=Europe/Stockholm
ENV TZ=$TZ

# Accept the build arguments
ARG DATABASE_URL
ARG FIREBASE_SERVICE_ACCOUNT
ARG VITE_PUBLIC_FIREBASE_API_KEY
ARG VITE_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG VITE_PUBLIC_FIREBASE_PROJECT_ID
ARG VITE_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_PUBLIC_FIREBASE_APP_ID

# Set them as environment variables within the container
ENV DATABASE_URL=$DATABASE_URL
ENV FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT
ENV VITE_PUBLIC_FIREBASE_API_KEY=$VITE_PUBLIC_FIREBASE_API_KEY
ENV VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=$VITE_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV VITE_PUBLIC_FIREBASE_PROJECT_ID=$VITE_PUBLIC_FIREBASE_PROJECT_ID
ENV VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=$VITE_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_PUBLIC_FIREBASE_APP_ID=$VITE_PUBLIC_FIREBASE_APP_ID

COPY . /usr/src/app
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install

RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

ARG TZ=Europe/Stockholm
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=sk-build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=sk-build /usr/src/app/package-lock.json /usr/src/app/package-lock.json
COPY --from=sk-build /usr/src/app/build /usr/src/app/build

RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm i --only=production

EXPOSE 3000
CMD ["node", "build/index.js"]