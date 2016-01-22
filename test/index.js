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

/*global describe, it, before */
var boscode = require('../lib/index.js');
var should = require('chai').should();
var assert = require('chai').assert;
var expect = require('chai').expect;
var util = require('util');
var rimraf = require('rimraf-then');
var Promise = require('bluebird');
var debug = require('debug')('boscode:index.js');
var fs = require('fs');
var os = require('os');

describe('boscode', function () {

  it('display', function () {
    boscode.display('Hello world');
    boscode.display(['1', {a:2},234]);
    boscode.display({ a: 4, b: 'yes' });
    boscode.display('Answer is ', 345, 'km');
    boscode.display('Answer is ', 345, 'km ', { a: 4, b: 'yes' });
  });

  //it('get', function () {
  //  this.timeout(15000);

  //  var test = boscode.get();
  //  boscode.display(test);
  //});




});



describe('sequential file', function () {


  it('missing filename', function () {
    expect(boscode.open).to.throw('open: first parameter missing (fileName)');
  });

  it('missing mode', function () {
    expect(function () {
      boscode.open('tst');
    }).to.throw('open: second parameter missing (mode) possible values: output, input, append, relative_access');
  });

  it('wrong mode', function () {
    expect(function () {
      boscode.open('tst','wrong');
    }).to.throw('open: second parameter wrong (mode) possible values: output, input, append, relative_access');
  });


  var createASequentialFile = function () {
    var friendsData = boscode.open('friendsData.txt', 'output');

    var firstName = 'Joe';
    var lastName = 'Bloggs';
    var emailAddress = 'jbloggs@example.com';

    var row = [firstName, lastName, emailAddress].join(','); // creates a comma separated string

    friendsData.write(row);

    firstName = 'Jim';
    lastName = 'Doe';
    emailAddress = 'jdoe@example.com';
    row = [firstName, lastName, emailAddress].join(','); // creates a comma separated string

    friendsData.write(row);

    friendsData.close();
  };


  it('createASequentialFile', function (done) {
    var debug = require('debug')('boscode:index.js createASequentialFile');
    var fileName = 'friendsData.txt';

    Promise.resolve().then(function () {
      debug('1');
      return rimraf(fileName);
    }).then(function () {
      assert(!fs.existsSync(fileName));
      debug('2');

    }).then(function () {
      createASequentialFile();
      var v = fs.existsSync(fileName);
      expect(v).to.be.equal(true);
      debug('3');
      return fs.readFileSync(fileName, {encoding: 'utf8'});
    }).then(function (content) {
      debug('content', content);
      expect(content).to.be.equal('Joe,Bloggs,jbloggs@example.com' + os.EOL + 'Jim,Doe,jdoe@example.com');
      return rimraf(fileName);
    }).finally(function () {
      debug('finally');
      done();
    });

  });





  var createASequentialFile2 = function () {
    var friendsData = boscode.open('friendsData.txt', 'output');    

    friendsData.write(['Joe', 'Bloggs', 'jbloggs@example.com'].join(','));
    friendsData.write(['Jim', 'Doe', 'jdoe@example.com'].join(','));
    friendsData.write(['xxx', '', ''].join(','));

    friendsData.close();
  };

  var removeSequentialFile = function () {
    return rimraf('friendsData.txt');
  };


  var displayFileContents = function () {
    var friendsData = boscode.open('friendsData.txt', 'input');

    var row = friendsData.read();
    var tempArray = row.split(',');
    var firstName = tempArray[0];
    var lastName = tempArray[1];
    var emailAddress = tempArray[2];

    while ( firstName !== 'xxx' ) {
      boscode.display(firstName, lastName, emailAddress);

      row = friendsData.read();
      tempArray = row.split(',');
      firstName = tempArray[0];
      lastName = tempArray[1];
      emailAddress = tempArray[2];
    }

    friendsData.close();
  };


  it('displayFileContents', function (done) {
    var debug = require('debug')('boscode:index.js createASequentialFile');
    var fileName = 'friendsData.txt';

    Promise.resolve().then(function () {
      createASequentialFile2();
      displayFileContents();

 
    }).finally(function () {
      debug('finally');
      done();
    });

  });

  it('read wrong mode', function () {
    createASequentialFile2();

    assert.throw( function(){
      var friendsData = boscode.open('friendsData.txt', 'output');
      friendsData.read();
    }, /read can only be called if file was opened for input/);

    assert.throw(function () {
      var friendsData = boscode.open('friendsData.txt', 'append');
      friendsData.read();
    }, /read can only be called if file was opened for input/);

    removeSequentialFile();
  });

  it('write wrong mode', function () {
    createASequentialFile2();

    assert.throw(function () {
      var friendsData = boscode.open('friendsData.txt', 'input');
      friendsData.write('test');
    }, /write can not be called if file was opened for input/);
    removeSequentialFile();
  });


  it('input file not existent', function () {

    removeSequentialFile();
    assert.throw(function () {
      var friendsData = boscode.open('friendsData.txt', 'input');
      friendsData.write('test');
    }, /for mode = input the file must exist. File friendsData.txt does not exist./);

  });


  var displayFileContentsEOF = function () {
    var friendsData = boscode.open('friendsData.txt', 'input');

    var row = friendsData.read();
    
    var tempArray, firstName, lastName, emailAddress;

    while (row !== boscode.EOF) {
      tempArray = row.split(',');
      firstName = tempArray[0];
      lastName = tempArray[1];
      emailAddress = tempArray[2];
      boscode.display(firstName, lastName, emailAddress);

      row = friendsData.read();
    }

    friendsData.close();
  };


  it('displayFileContentsEOF', function (done) {
    var debug = require('debug')('boscode:index.js displayFileContentsEOF');
    var fileName = 'friendsData.txt';

    Promise.resolve().then(function () {
      createASequentialFile2();
      displayFileContentsEOF();


    }).finally(function () {
      debug('finally');
      done();
    });

  });


});



describe('relative file', function () {
  
  it('write missing parameters', function () {
    var productData = boscode.open('productData.txt', 'relative_access');
    expect(function () {
      productData.write();
    }).to.throw('relative file write: missing parameters: write(object, usingKey)');
  });

  it('write missing parameters', function () {
    var productData = boscode.open('productData.txt', 'relative_access');
    expect(function () {
      productData.write({});
    }).to.throw('relative file write: missing parameters: write(object, usingKey)');
  });

  it('write wrong using key', function (done) {


    Promise.resolve().then(function () {
      return rimraf('productData.txt');
    }).then(function () {

      var productData = boscode.open('productData.txt', 'relative_access');

      var productObject = {
        productNumber: 1,
        description: 'Laundry Liquid 2L',
        quantity: 100,
        price: 1.49
      };

      expect(function () {

        productData.write(productObject, 'wrong using key');
      }).to.throw(/relative file write: wrong using key wrong using key - object does not contain this key: { productNumber: 1,\n  description: \'Laundry Liquid 2L\',\n  quantity: 100,\n  price: 1.49 }/);


      return rimraf('productData.txt');
    }).finally(function () {
      debug('finally');
      done();
    });

  });

  it('write wrong using key less than 1', function () {
    var productData = boscode.open('productData.txt', 'relative_access');

    var productObject = {
      productNumber: 0,
      description: 'Laundry Liquid 2L',
      quantity: 100,
      price: 1.49
    };

    expect(function () {
      productData.write(productObject, 'productNumber');
    }).to.throw(/relative file write: wrong key value 0 - The key field used must contain positive integer values only./);
  });


  var createARelativeFile = function () {
    var productData = boscode.open('productData.txt', 'relative_access');

    var productObject = {
      productNumber: 1,
      description: 'Laundry Liquid 2L',
      quantity: 100,
      price: 1.49
    };

    productData.write(productObject, 'productNumber');

    productData.close();
  };


  it('createARelativeFile', function (done) {
    var debug = require('debug')('boscode:index.js createARelativeFile');
    var fileName = 'productData.txt';

    Promise.resolve().then(function () {
      debug('1');
      return rimraf(fileName);
    }).then(function () {
      assert(!fs.existsSync(fileName));
      debug('2');

    }).then(function () {
      createARelativeFile();
      var v = fs.existsSync(fileName);
      expect(v).to.be.equal(true);
      debug('3');
      return fs.readFileSync(fileName, { encoding: 'utf8' });
    }).then(function (content) {
      debug('content', content);
      expect(content).to.be.equal('{"valueArray":[{"productNumber":1,"description":"Laundry Liquid 2L","quantity":100,"price":1.49}],"usingKey":"productNumber"}');
      return rimraf(fileName);
    }).finally(function () {
      debug('finally');
      done();
    });

  });


  var createARelativeFile2 = function () {
    var productData = boscode.open('productData.txt', 'relative_access');

    var productObject = {
      productNumber: 1,
      description: 'Laundry Liquid 2L',
      quantity: 100,
      price: 1.49
    };

    productData.write(productObject, 'productNumber');

    productObject = {
      productNumber: 2,
      description: 'Mate Laundry Liquid 1L',
      quantity: 300,
      price: 3.99
    };

    productData.write(productObject, 'productNumber');

    productData.close();
  };


  it('createARelativeFile2', function (done) {
    var debug = require('debug')('boscode:index.js createARelativeFile');
    var fileName = 'productData.txt';

    Promise.resolve().then(function () {
      debug('1');
      return rimraf(fileName);
    }).then(function () {
      assert(!fs.existsSync(fileName));
      debug('2');

    }).then(function () {
      createARelativeFile2();
      var v = fs.existsSync(fileName);
      expect(v).to.be.equal(true);
      debug('3');
      return fs.readFileSync(fileName, { encoding: 'utf8' });
    }).then(function (content) {
      debug('content', content);
      expect(content).to.be.equal('{"valueArray":[{"productNumber":1,"description":"Laundry Liquid 2L","quantity":100,"price":1.49},{"productNumber":2,"description":"Mate Laundry Liquid 1L","quantity":300,"price":3.99}],"usingKey":"productNumber"}');
      //return rimraf(fileName);
    }).finally(function () {
      debug('finally');
      done();
    });

  });


  it('read missing parameter', function () {
    var productData = boscode.open('productData.txt', 'relative_access');
    expect(function () {
      productData.read();
    }).to.throw('relative file read: missing parameter: read(usingValue)');
  });

  it('read new file', function (done) {

    Promise.resolve().then(function () {
      return rimraf('productData.txt');
    }).then(function () {
      var productData = boscode.open('productData.txt', 'relative_access');

      var record = productData.read(1);
      assert.equal(record, boscode.RECORD_NOT_FOUND);
    }).finally(function () {
      debug('finally');
      done();
    });
  });




  var readRecordsFromARelativeFile = function () {
    var productData = boscode.open('productData.txt', 'relative_access');

    var requiredProdNumber = 1;

    var productRecord = productData.read(requiredProdNumber);

    if (productRecord === boscode.RECORD_NOT_FOUND) {
      boscode.display('Sorry - no such product');
    } else {
      boscode.display( JSON.stringify(productRecord) );
    }    

    productData.close();
  };


  it('readRecordsFromARelativeFile', function (done) {
    var debug = require('debug')('boscode:index.js createARelativeFile');
    var fileName = 'productData.txt';

    Promise.resolve().then(function () {  
      createARelativeFile2();
      readRecordsFromARelativeFile();
      //return rimraf(fileName);
    }).finally(function () {
      debug('finally');
      done();
    });

  });


  var updateRecordsInARelativeFile = function () {
    var productData = boscode.open('productData.txt', 'relative_access');

    var requiredProdNumber = 1;

    var productRecord = productData.read(requiredProdNumber);

    if (productRecord === boscode.RECORD_NOT_FOUND) {
      boscode.display('Sorry - no such product');
    } else {
      boscode.display(JSON.stringify(productRecord));
      productRecord.price = 1000;

      productData.write(productRecord, 'productNumber');
    }

    productData.close();
  };


  it('updateRecordsInARelativeFile', function (done) {
    var debug = require('debug')('boscode:index.js updateRecordsInARelativeFile');
    var fileName = 'productData.txt';

    Promise.resolve().then(function () {
      createARelativeFile2();
      updateRecordsInARelativeFile();
      //return rimraf(fileName);
    }).finally(function () {
      debug('finally');
      done();
    });

  });











});
