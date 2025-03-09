FROM golang:1.24 AS build

WORKDIR /app

ARG TARGETARCH

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs

ENV ENV=prod
ENV TARGETARCH=${TARGETARCH}
ENV GOARCH=${TARGETARCH}
ENV GOOS=linux

COPY . .

RUN (cd webapp && npm install)
RUN make tidy build

FROM golang:1.24

WORKDIR /app

COPY --from=build /app/.out/yeahnah .
COPY --from=build /app/.out/public ./public

ENV ENV=prod

EXPOSE 8090

ENTRYPOINT ["/app/yeahnah", "serve", "--http", "0.0.0.0:8090"]
