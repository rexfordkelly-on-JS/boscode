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

  firstName = "Joe"
  lastName = "Bloggs"
  emailAddress = "jbloggs@example.com"

  Write FriendsData from firstName, lastName, emailAddress

  firstName = "Jim"
  lastName = "Doe"
  emailAddress = "jdoe@example.com"

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
## Relative file

### Creating a relative file

Pseudocode
```
BEGIN CreateARelativeFile
  Open ProductData for relative access

  productNumber = 1
  description = "Laundry Liquid 2L"
  quantity = 100
  price = 1.49

  Write ProductData from productNumber, description, quantity, price using productNumber

  ’note the use of the variable productNumber as the key field, specifying where this record will be written in the file.

  productNumber = 2
  description = "Mate Laundry Liquid 1L"
  quantity = 300
  price = 3.99

  Write ProductData from productNumber, description, quantity, price using productNumber

  Close ProductData
END CreateARelativeFile
```

Javascript
```js
var createARelativeFile = function () {
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


```


### Reading from a relative file

Pseudocode
```
BEGIN ReadRecordsFromARelativeFile
  Open ProductData for relative access

  RequiredProdNumber = 1

  Read ProductData into productNumber, description, quantity, price using RequiredProdNumber
  ’note the use of the variable RequiredProdNumber as the key field, specifying where this record will be found in the file
  
  IF RecordNotFound THEN
    ’note the use of the flag RecordNotFound returned by the operating system 
    Display “Sorry – no such product”
  ELSE
    Display productNumber, description, quantity, price
  END IF
  
  Close ProductData
END ReadRecordsFromARelativeFile

```

Javascript
```js
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

//{"productNumber":1,"description":"Laundry Liquid 2L","quantity":100,"price":1.49}


```


### Updating records in a relative file

Pseudocode
```
BEGIN UpdateRecordsInARelativeFile
  Open ProductData for relative access

  RequiredProdNumber = 1

  Read ProductData into productNumber, description, quantity, price using RequiredProdNumber
  
  IF RecordNotFound THEN
    'note the use of the flag RecordNotFound returned by the operating system 
    Display “Sorry – no such product”
  ELSE
    Display productNumber, description, quantity, price
    newPrice = 1000

    Write ProductData from productNumber, description, quantity, newPrice using productNumber
    'update record using data for the new price and the existing data in the other fields

  END IF
  
  Close ProductData
END UpdateRecordsInARelativeFile

```

Javascript
```js
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


```
[more pseudocode examples](docs/pseudocode.md)