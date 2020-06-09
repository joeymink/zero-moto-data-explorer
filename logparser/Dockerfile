FROM python:3.8-alpine

RUN apk update

RUN apk add git
RUN apk add sqlite

RUN mkdir /app
WORKDIR /app

RUN mkdir /app/parsed-logs
RUN mkdir /app/json-logs
RUN mkdir /app/bike-logs

# clone zero log parser and extractor
RUN git clone https://github.com/zero-motorcycle-community/zero-log-parser.git
RUN git clone https://github.com/zero-motorcycle-community/zero-log-data-extractor.git

COPY ./scripts/jsonify-bike-logs.sh /app/jsonify-bike-logs.sh

CMD ["./jsonify-bike-logs.sh"]

