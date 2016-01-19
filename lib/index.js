/**
*
* Copyright (c) 2016 Matthias Ludwig
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is furnished
* to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
* OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
* OR OTHER DEALINGS IN THE SOFTWARE.
**/
'use strict';
var readlineSync = require('readline-sync');
var _ = require('lodash');
var fs = require('fs');
var debug = require('debug')('boscode:index.js');
var os = require('os');


module.exports.display = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  var result = args.join('');
  console.log(result);
};


module.exports.get = function (value) {
  return readlineSync.question(value);
};



var SequentialFile = function (opts) {
  var debug = require('debug')('boscode:index.js SequentialFile');

  if (!(this instanceof SequentialFile)) {
    return new SequentialFile(opts);
  }

  _.merge(this, opts);

  debug('opts', opts);
  debug('this', this);

  if (this.mode === 'output') {
    fs.writeFileSync(this.fileName, '{file opened for output by boscode. Use close to write your data.}');
    this.contentArray = [];
  }

  if (this.mode === 'input' || this.mode === 'append') {
    this.content = fs.readFileSync(this.fileName);
    debug('this.content', this.content);
  }


};

SequentialFile.prototype.write = function (stringValue) {
  var self = this;
  this.contentArray.push(stringValue);
};

SequentialFile.prototype.close = function () {
  var self = this;
  var content = this.contentArray.join(os.EOL);
  fs.writeFileSync(this.fileName, content);
};

module.exports.open = function (fileName, mode) {
  if (!fileName) {
    throw 'boscode open: first parameter missing (fileName)';
  }
  if (!mode) {
    throw 'boscode open: second parameter missing (mode) possible values: output, input, append, relativ_access';
  }
  if (mode !== 'input' && mode !== 'output' && mode !== 'append' && mode !== 'relativ_access') {
    throw 'boscode open: second parameter wrong (mode) possible values: output, input, append, relativ_access';
  }

  if (mode === 'input' || mode === 'output' || mode === 'append' ) {
    return new SequentialFile({ fileName: fileName, mode: mode });
  }
};
