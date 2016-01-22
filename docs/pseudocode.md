It is expected that students are able to develop and interpret algorithms using pseudocode and flowcharts.

# Pseudocode

## Pseudocode guidelines
The pseudocode keywords are:

* for each procedure or subroutine
```
BEGIN name
END name
```
* for binary selection
```
IF condition THEN
  statements
ELSE
  statements
ENDIF
```
* for multi-way selection
```
CASEWHERE expression evaluates to
  A: process A
  B: process B
  ....
  OTHERWISE: process ...
ENDCASE
```
* for pre-test repetition
```
WHILE condition
  statements
ENDWHILE
```
* for post-test repetition
```
REPEAT
  statements
UNTIL condition
```
* for FOR/NEXT loops
```
FOR variable = start TO finish STEP increment
  statements
NEXT variable
```

In pseudocode:
* keywords are written in capitals
* structural elements come in pairs, eg for every BEGIN there is an END, for every IF there is an ENDIF.
* indenting is used to identify control structures in the algorithm
* the names of subprograms are underlined. This means that when refining the solution to a problem, a subroutine can be referred to in an algorithm by underlining its name, and a separate subprogram developed to show the logic of that routine. This feature enables the use of the top-down development concept, where details for a particular process need only be considered within the relevant subroutine.
*

___

## Examples

### Sequence 
```
Get firstNumber
Get secondNumber
sum = firstNumber + secondNumber
Display "the sum of your 2 numbers is ", sum
```

___

### Binary selection
```
myguess = 7
Get guess
IF guess = myguess THEN
  Display "Well done — you guessed my number!"
ELSE
  Display "That is not correct"
ENDIF
```

___

### Casewhere
```
BEGIN  
  N = 20  
  CASEWHERE n is    
    less than 10 : n = n + 5
    30 : Display "n is thirty"
    greater than 50 : n = n + 30    
    OTHERWISE : n = n + 50  
  ENDCASE  
  Display n 
END
```

___

### Pre-test repetition: while
```
BEGIN 
  number = 5 
  WHILE number < 200  
    Display number  
    Increment number by 2 
  ENDWHILE 
END
	
```

___

### Post-test repetition: repeat
```
BEGIN 
  number = 0
  REPEAT  
    Display number  
    number = number + 2 
  UNTIL number > 200 
END	
```

___

### FOR/NEXT or counted loop
```
BEGIN
  FOR i = 1 to 12 STEP 1
    Display "12 x ", i," = ", (12 * i) 
  NEXT i
END
```

___

### Subprogram
```
BEGIN Main
  Get a
  Get b
  Sum(a,b,c)
  Display "a + b = ", c
END Main

BEGIN Sum
  c = a + b
END Sum
```
Note: The word <u>Sum</u> should be underlined in the above code
___

### Load array
```
BEGIN LoadArray
  i = 1
  Get DataValue
  WHILE DataValue < > "xxx"
    element(i) = DataValue
    i = i + 1
    Get DataValue
  ENDWHILE
  numElements = i
  Display "There are", numElements, " items loaded into the array" 
END LoadArray

```

___

### Print array contents
```
BEGIN PrintArrayContents
  element(1) = 3
  element(2) = 7
  element(3) = 10

  i = 1
  WHILE i <= 3
    Display element(i) 
    i = i + 1
  ENDWHILE
END PrintArrayContents
```

___

### Add the contents of an array
```
BEGIN SumArrayContents
  element(1) = 3
  element(2) = 7
  element(3) = 10

  i = 1
  sum = 0

  WHILE i <= 3
    sum = sum + element(i)
    i = i + 1
  ENDWHILE  

  Display "The sum of all of the elements in the array = " , sum 

END SumArrayContents
```

___

### Find maximum value in an array
```
BEGIN FindMAX
  element(1) = 3
  element(2) = 7
  element(3) = 23
  element(4) = 3
  element(5) = 7
  element(6) = 10

  maxIndex = 1
  i = 2 
  WHILE i < 7
    IF element(i) > element(maxIndex) THEN
      maxIndex = i
    END IF
    
    i = i + 1
  ENDWHILE

  max = element(maxIndex)
  Display "The highest value is ", max, " at position ", maxIndex 

END FindMAX
```
___

### Find minimum value in an array
```
BEGIN FindMIN
  element(1) = 3
  element(2) = 7
  element(3) = 23
  element(4) = 3
  element(5) = 7
  element(6) = 10

  maxIndex = 1
  i = 2 
  WHILE i < 7
    IF element(i) < element(maxIndex) THEN
      maxIndex = i
    END IF
    
    i = i + 1
  ENDWHILE

  max = element(maxIndex)
  Display "The highest value is ", max, " at position ", maxIndex 

END FindMIN
```

