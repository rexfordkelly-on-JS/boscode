# boscode

Node.js pseudocode javascript helper methods for learning pseudocode compliant with Board of studies, New South Wales, Australia, Software Design and Development Stage 6, [Software and Course Specifications Higher School Certificiate 2012](http://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/software-design-development-course-specs.pdf)


[![NPM](https://nodei.co/npm/boscode.png?downloads=true&downloadRank=true)](https://nodei.co/npm/boscode/)
[![NPM](https://nodei.co/npm-dl/boscode.png?months=6&height=3)](https://nodei.co/npm/boscode/)

## Installation
```    
npm install boscode
```

Then:

```js
var boscode = require('boscode');
```

## Console input/output
---
### display

#### Example 1
Pseudocode
```
Display "Hello world"
```
Javascript
```js
boscode.display('Hello world');
//Hello world
```
#### Example 2
Pseudocode
```
Display "The answer is ", 4, "km"
```
Javascript
```js
boscode.display('The answer is ', 4, 'km');
//The answer is 4km
```



---
### get

Pseudocode
```
Get firstNumber
```

Javascript
```js
var firstNumber = boscode.get();
```

## Sequential file


### Creating a sequential file

Pseudocode
```
BEGIN CreateASequentialFile
  Open FriendsData for output

  Let firstName = "Joe"
  Let lastName = "Bloggs"
  Let emailAddress = "jbloggs@example.com"

  Write FriendsData from firstName, lastName, emailAddress

  Let firstName = "Jim"
  Let lastName = "Doe"
  Let emailAddress = "jdoe@example.com"

  Write FriendsData from firstName, lastName, emailAddress

  Close FriendsData
END CreateASequentialFile


```

Javascript
```js

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

// content of friendsData.txt:
// Joe,Bloggs,jbloggs@example.com
// Jim,Doe,jdoe@example.com

```
