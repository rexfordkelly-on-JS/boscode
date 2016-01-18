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



module.exports.display = function (value) {
  console.log(value);
};


module.exports.get = function () {
  return readlineSync.question('');
};



var SequentialFile = function (opts) {
  if (!(this instanceof SequentialFile)) {
    return new SequentialFile(opts);
  }

  _.merge(this, opts);
};


module.exports.open = function (fileName, mode) {
  if (!fileName) {
    throw 'open: first parameter missing (fileName)';
  }
  if (!mode) {
    throw 'open: second parameter missing (mode) possible values: output, input, append, relativ_access';
  }
  if (mode !== 'input' || mode !== 'output' || mode !== 'append' || mode !== 'relativ_access') {
    throw 'open: second parameter wrong (mode) possible values: output, input, append, relativ_access';
  }

  return new SequentialFile({ fileName: fileName, mode: mode });
};
