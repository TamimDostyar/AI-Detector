FROM python:3.10-alpine

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt
RUN jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root