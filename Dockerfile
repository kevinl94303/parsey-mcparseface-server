FROM tensorflow/syntaxnet

WORKDIR /opt/tensorflow/syntaxnet

COPY . /opt/tensorflow/syntaxnet

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 80

CMD ["python", "app.py"]
