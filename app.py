from flask import Flask, request
import os
import socket
import sys

app = Flask(__name__)

@app.route("/", methods=['POST'])
def parse():
    if request.method == 'POST':
        data = request.form
        if 'doc' not in data or len(data['doc']) == 0:
            return '<i>Rip</i>'
        doc = data.get('doc')

        parsed_doc = ''

        read_doc, write_doc = os.pipe() 
        read_parse, write_parse = os.pipe()
        sys.stderr.write('{}\n'.format(doc))

        pid = os.fork()

        if pid == 0:
            # Child Process
            os.close(write_doc)
            os.close(read_parse)
            os.dup2(read_doc, 0)
            os.dup2(write_parse, 1)
            os.close(read_doc)
            os.close(write_parse)
            os.execl('/bin/bash', '-v', './parse.sh')

        else:
            # Parent Process
            os.close(read_doc)
            os.close(write_parse)
            os.write(write_doc, doc)
            os.close(write_doc)
            sys.stderr.write('before waitpid\n')
            os.waitpid(pid, 0)
            sys.stderr.write('finished waitpid\n')

            line = os.read(read_parse, 255)
            parsed_doc += line

            while(line != ''):
                line = os.read(read_parse, 255)
                sys.stderr.write(line)
                parsed_doc += line

            os.close(read_parse)

        return parsed_doc

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
