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

### display

Pseudocode
```
Display "Hello world"
```

Javascript
```js
boscode.display('Hello world');
```

### get

Pseudocode
```
get firstNumber
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

  Let firstName2 = "Jim"
  Let lastName2 = "Doe"
  Let emailAddress2 = "jdoe@example.com"

  Write FriendsData from firstName2, lastName2, emailAddress2

  Close FriendsData
END CreateASequentialFile


```

Javascript
```js

var createASequentialFile = function(){
  var friendsData = boscode.open('friendsData.txt','output');

  var firstName = 'Joe';
  var lastName = 'Bloggs';
  var emailAddress = 'jbloggs@example.com';

  friendsData.write(firstName, lastName, emailAddress);

  var firstName2 = 'Jim';
  var lastName2 = 'Doe';
  var emailAddress2 = 'jdoe@example.com';

  friendsData.write(firstName2, lastName2, emailAddress2);

  friendsData.close();
}


```

