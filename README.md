# syntaxnet-server
Flask app to serve Syntaxnet Parsey McParseface parser

To start Syntaxnet server, run `docker build --tag=syntaxnet . && docker run -p 8000:80 syntaxnet`.

The server accepts POST requests to localhost:8000, with the body including a key called "doc", with a value of the sentence to be parsed.
