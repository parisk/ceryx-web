FROM node:8 as static

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install && npm run sass && npm run webpack

FROM python:3.6
ENV FLASK_APP app.py
COPY . /usr/src/app
COPY --from=static /usr/src/app/static/dist /usr/src/app/static/dist
WORKDIR /usr/src/app

CMD ["flask", "run", "--port=5000"]
