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
var util = require('util');
var JSONPath = require('JSONPath');

module.exports.display = function (value) {
  var debug = require('debug')('boscode:index.js display');
  //debug('arguments', arguments);
  //debug('arguments.length', arguments.length);

 

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 0);
    
    value = args.reduce(function (previousValue, currentValue) {

      if (typeof currentValue !== 'string') {
        currentValue = JSON.stringify(currentValue);
      }

      var result = previousValue + currentValue;
      return result;
     
    }, '');

  }
 
  console.log(value);
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

  //debug('opts', opts);
  //debug('this', this);

  if (this.mode === 'output') {
    fs.writeFileSync(this.fileName, '{file opened for output by boscode. Use close to write your data.}');
    this.contentArray = [];
  }

  if (this.mode === 'input' || this.mode === 'append') {   
    var content = fs.readFileSync(this.fileName, { encoding: 'utf8' });
    this.contentArray = content.split(os.EOL);
    this.currentIndex = 0;
  }


};

SequentialFile.prototype.write = function (stringValue) {
  if (this.mode === 'input') {
    throw util.format('write can not be called if file was opened for input');
  }
  var self = this;
  this.contentArray.push(stringValue);
};

SequentialFile.prototype.read = function () {
  var debug = require('debug')('boscode:index.js read');

  //debug('this', this);

  if ( this.mode !== 'input') {
    throw util.format('read can only be called if file was opened for input');
  }

  if (this.currentIndex > this.contentArray.length -1){
    return module.exports.EOF;
  }

  var result = this.contentArray[this.currentIndex++];
  return result;
};

module.exports.EOF = 'EOF_END_OF_FILE_VALUE';

module.exports.RECORD_NOT_FOUND = 'RECORD_NOT_FOUND_VALUE';

SequentialFile.prototype.close = function () {
  if (this.mode !== 'input') {
    var content = this.contentArray.join(os.EOL);
    fs.writeFileSync(this.fileName, content);
  } 
};

module.exports.open = function (fileName, mode) {
  var debug = require('debug')('boscode:index.js open');

  if (!fileName) {
    throw 'boscode open: first parameter missing (fileName)';
  }
  if (!mode) {
    throw 'boscode open: second parameter missing (mode) possible values: output, input, append, relative_access';
  }
  if (mode !== 'input' && mode !== 'output' && mode !== 'append' && mode !== 'relative_access') {
    throw 'boscode open: second parameter wrong (mode) possible values: output, input, append, relative_access';
  }

  if ( mode === 'output' || mode === 'append' ) {
    return new SequentialFile({ fileName: fileName, mode: mode });
  }

  if (mode === 'input') {
    if (!fs.existsSync(fileName)) {
      throw util.format('for mode = input the file must exist. File %s does not exist.', fileName);
    }  

    return new SequentialFile({ fileName: fileName, mode: mode });
  }

  if (mode === 'relative_access') {
   
    return new RelativeFile({ fileName: fileName});
  }

};



var RelativeFile = function (opts) {
  var debug = require('debug')('boscode:index.js RelativeFile');

  if (!(this instanceof RelativeFile)) {
    return new RelativeFile(opts);
  }

  _.merge(this, opts);

  //debug('opts', opts);
  //debug('this', this);

  if (fs.existsSync(this.fileName)) {
    var content = fs.readFileSync(this.fileName, { encoding: 'utf8' });
    this.contentObject = JSON.parse(content);
  } else {
    this.contentObject = {
      valueArray: []
    };
  }

};


RelativeFile.prototype.write = function (object, usingKey) {
  var debug = require('debug')('boscode:index.js RelativeFile write');

  if (!object || !usingKey) {
    throw util.format('relative file write: missing parameters: write(object, usingKey)');
  }

  if (this.contentObject.usingKey && this.contentObject.usingKey !== usingKey) {
    throw util.format('relative file write: wrong using key %s should be equal to %s', usingKey, this.contentObject.usingKey);
  }

  if (!this.contentObject.usingKey) {
    this.contentObject.usingKey = usingKey;
  }

  var keyValue = object[usingKey];
  if (!keyValue && keyValue !== 0) {
    throw util.format('relative file write: wrong using key %s - object does not contain this key: %s', usingKey, util.inspect(object));
  }
  keyValue = parseInt(keyValue);
  if (keyValue < 1) {
    throw util.format('relative file write: wrong key value %s - The key field used must contain positive integer values only.', keyValue);
  }

  //
  var jsonPath = util.format('$.[?(@.%s === %s)]', usingKey, keyValue);
  //debug('jsonPath', jsonPath);
  var result = JSONPath({ json: this.contentObject.valueArray, path: jsonPath });
  //debug('result', result);
  if (result && result.length > 0) {
    var record = result[0];
    var newResult = _.mapValues(record, function (value, key) {
      record[key] = object[key];
      return object[key];
    });
    //debug('newResult', newResult);
    //debug('record', record);
  } else {
    this.contentObject.valueArray.push(object);
  }
  //debug('this.contentObject', this.contentObject);

};

RelativeFile.prototype.read = function (usingValue) {
  var debug = require('debug')('boscode:index.js RelativeFile read');

  if (!usingValue) {
    throw util.format('relative file read: missing parameter: read(usingValue)');
  }

  if (!this.contentObject || !this.contentObject.usingKey) {
    return module.exports.RECORD_NOT_FOUND;
  }

  var jsonPath = util.format('$.[?(@.%s === %s)]', this.contentObject.usingKey, usingValue);
  //debug('jsonPath', jsonPath);
  var result = JSONPath({ json: this.contentObject.valueArray, path: jsonPath });
  //debug('result', result);

  return _.clone(result[0]); 
};

RelativeFile.prototype.close = function () {
  var self = this;
  var content = JSON.stringify(this.contentObject);
  fs.writeFileSync(this.fileName, content);
};

