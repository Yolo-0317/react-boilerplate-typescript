interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Bob", "Fred"];

const myStr: string = myArray[0];

console.log(myStr)