FROM node:8 as static

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install && npm run sass && npm run webpack

FROM python:3.6
ENV FLASK_APP app.py
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app
RUN pip install pipenv==9.0.1

COPY . /usr/src/app
RUN pipenv install --system
COPY --from=static /usr/src/app/static/dist /usr/src/app/static/dist

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
