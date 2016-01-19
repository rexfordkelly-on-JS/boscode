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

  //it('display', function () {
  //  boscode.display('Hello world');
  //});

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
    }).to.throw('open: second parameter missing (mode) possible values: output, input, append, relativ_access');
  });

  it('wrong mode', function () {
    expect(function () {
      boscode.open('tst','wrong');
    }).to.throw('open: second parameter wrong (mode) possible values: output, input, append, relativ_access');
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
