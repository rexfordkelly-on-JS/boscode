# boscode

Node.js pseudocode javascript helper methods for learning pseudocode compliant with Board of studies (BOS), New South Wales, Australia, Software Design and Development Stage 6.

[Software and Course Specifications Higher School Certificiate 2012](http://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/software-design-development-course-specs.pdf)


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

### Printing the contents of a file using sentinel value

Pseudocode
```
BEGIN DisplayFileContents
  Open FriendsData for input

  Read firstName, lastName, emailAddress from FriendsData
  ’This is a priming read, performed just before entering the loop to provide
  'the first record (if there is one) for printing

  WHILE firstName <> “xxx”
    Display firstName, lastName, emailAddress
    Read firstName, lastName, emailAddress from FriendsData
    ’this reads subsequent records which can then be tested for the sentinel
    'value before they are processed
  END WHILE

  Close FriendsData
END DisplayFileContents

```

Javascript
```js
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


```

### Printing the contents of a file using EOF (end of file)

Pseudocode
```
BEGIN DisplayFileContents
  Open FriendsData for input

  Read firstName, lastName, emailAddress from FriendsData
  ’This is a priming read, performed just before entering the loop to provide
  'the first record (if there is one) for printing

  WHILE not EOF
    Display firstName, lastName, emailAddress
    Read firstName, lastName, emailAddress from FriendsData
    ’this reads subsequent records which can then be tested for the sentinel
    'value before they are processed
  END WHILE

  Close FriendsData
END DisplayFileContents

```

Javascript
```js
var displayFileContents = function () {
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


```



### Appending rows to an existing sequential file

Pseudocode
```
BEGIN AppendNewRows
  Open FriendsData for append

  Display “Please enter the details for the first new person to be added:”
  Display “Enter xxx for first name to indicate there are no more rows to be added.”

  Get firstName, lastName, emailAddress

  WHILE firstName <> “xxx”
    Write FriendsData from firstName, lastName, emailAddress

    Display “Please enter the details for the next new person to be added:”

    Get firstName, lastName, emailAddress
  END WHILE

  Close FriendsData
END AppendNewRows
```

Javascript
```js
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


```


### Creating a relative file

Pseudocode
```
BEGIN CreateARelativeFile
  Open ProductData for relative access
  
  FOR i = 1 to 10
    Display “Please enter the details for the next product: ”
    Get productNumber, description, quantity, price
    Write ProductData from productNumber, description, quantity, price using productNumber
    ’note the use of the variable productNumber as the key field, specifying where this record will be written in the file.
  NEXT i

  Close ProductData 
END CreateARelativeFile
```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```


### Printing

Pseudocode
```

```

Javascript
```js



```
