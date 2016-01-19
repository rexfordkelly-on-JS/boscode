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

//boscode.display('Your name:');
//var name = boscode.get();
//boscode.display('Hello ', name);

//##################################################### createASequentialFile

var removeSequentialFile = function () {
  return rimraf('friendsData.txt');
};

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

var appendNewRows = function () {
  var friendsData = boscode.open('friendsData.txt', 'append');

  boscode.display('Please enter the details for the first new person to be added:');
  boscode.display('Enter xxx for first name to indicate there are no more rows to be added.');

  var firstName = boscode.get('First Name:');
  var lastName = boscode.get('Last Name:');
  var emailAddress = boscode.get('Email Address:');
  var row = [firstName, lastName, emailAddress].join(',');

  while (firstName !== 'xxx') {

    friendsData.write(row);

    boscode.display('Please enter the details for the next new person to be added:');
   
    firstName = boscode.get('First Name:');
    lastName = boscode.get('Last Name:');
    emailAddress = boscode.get('Email Address:');
    row = [firstName, lastName, emailAddress].join(',');
  }

  friendsData.close();
};

createASequentialFile();
appendNewRows();