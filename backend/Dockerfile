FROM python:3.10-slim

workdir app

COPY ./requirements.txt requirements.txt

RUN pip install -r ./requirements.txt

CMD ['python', 'app.py']