FROM tensorflow/syntaxnet

WORKDIR /opt/tensorflow/syntaxnet

COPY frontend/build /opt/tensorflow/syntaxnet/frontend/build

COPY server /opt/tensorflow/syntaxnet/server

COPY scripts/parse.sh /opt/tensorflow/syntaxnet/syntaxnet/parse.sh

RUN pip install --trusted-host pypi.python.org -r server/requirements.txt

RUN chmod -R 777 frontend/build

EXPOSE 80

CMD ["python", "server/app.py"]
