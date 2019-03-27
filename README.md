# Syntaxnet Server
Flask app to serve Syntaxnet Parsey McParseface parser

To start Syntaxnet server, run `docker build --tag=syntaxnet . && docker run -p 8000:80 syntaxnet`.

The server accepts POST requests to localhost:8000, with the payload including a key called "doc", with a value of the sentence to be parsed.

For example:
![Postman Example](https://github.com/kevinl94303/syntaxnet-server/blob/master/static-assets/request.png?raw=true "Postman Example")
