FROM python:3.11

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./algo.py /code/
COPY ./deserialize.py /code/
COPY ./entity.py /code/
COPY ./globals.py /code/
COPY ./main.py /code/
COPY ./parsers.py /code/
COPY ./utils.py /code/
COPY ./static /code/static


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9999"]