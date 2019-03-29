# Parsey McParseface Server
Flask app to serve Google's Parsey McParseface parser. Built with Docker, Flask, Javascript ES6, D3, and Bootstrap 3. 

To start Parsey McParseface server, navigate to `/server` and run `docker build --tag=syntaxnet . && docker run -p 8000:80 syntaxnet`.

The server accepts POST requests to http://localhost:8000, with the payload including a key called "doc", with a value of the sentence to be parsed. Use the headers
```
"Content-Type": "application/json",
"Accept": "application/json"
```
to receive a JSON, with 'body' being the key for the dependency parsing CoNLL. To receive the raw CoNLL, use the headers
```
"Content-Type": "application/json",
"Accept": "text/plain"
```

For example, the following example is with a header requesting a JSON:
![Postman Example](https://github.com/kevinl94303/syntaxnet-server/blob/master/static-assets/request.png?raw=true "Postman Example")

There is a front-end interface to test and display results of the dependency parsing visually, which can be accessed in the browser at http://localhost:8000. 

![Frontend](https://github.com/kevinl94303/syntaxnet-server/blob/master/static-assets/frontend.png?raw=true "Frontend Interface")

Acknowledgements:
The frontend is adapted from a repository by Alireza Nourian, which can be found [here](https://github.com/sobhe/dependency-parse-tree/tree/gh-pages). 
