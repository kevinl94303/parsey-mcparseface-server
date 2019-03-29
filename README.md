# SyntaxNet Server
Flask app to serve SyntaxNet Parsey McParseface parser

To start SyntaxNet server, navigate to `/server` and run `docker build --tag=syntaxnet . && docker run -p 8000:80 syntaxnet`.

The server accepts POST requests to localhost:8000, with the payload including a key called "doc", with a value of the sentence to be parsed.

For example:
![Postman Example](https://github.com/kevinl94303/syntaxnet-server/blob/master/static-assets/request.png?raw=true "Postman Example")

Acknowledgements:
The frontend is adapted from a repository by Alireza Nourian, which can be found [here](https://github.com/sobhe/dependency-parse-tree/tree/gh-pages). 