const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const fs = require('fs').promises;

class NameCounter {
    private _name: string;
    private _count: number = 0;
    constructor(name: string) {this._name = name;}
    get name(): string {return this._name;}
    get count(): number {return this._count;}
    incrementCounter() {this._count++}
  }

  let counterArray: Array<NameCounter> = []
  // let counter: number = 0; //test

  const countNames = async ()=>{  
    try {
      let rl = createInterface({
        input: createReadStream('./oliver-twist.txt')
      });
      rl.on('line', (line: string) => {
        counterArray.forEach((nameCounter, i)=>{
          let name = nameCounter.name;
          // let name = 'Andrew' //test
          let uppercaseName = name.toUpperCase();
          let testVariable = '('+name+'|'+uppercaseName+')'

          // let re = new RegExp(testVariable);//test
          let re2 = new RegExp('(.*[\W_\'(",-]+|^)'+testVariable+'([.,_";!:\?-]+.*$|[\?,]\'$|[\!\?<>\":;{}\[\]@£$%^&\*()_+=,-]+\'|\'[sS][\!\?<>\":;{}\[\]@£$%^&\*()_+=,-]+.*|\'[Ss]|\'$|$)');
          
          let lineArray: Array<string> = line.split(' ').filter(word=> re2.test(word) ? word:null);
          // let lineArray: Array<string> = line.split(' ').filter(word=> re.test(word) && !re2.test(word) ? word:null); //test
          lineArray.forEach(word=>{
            // console.log(word);//test
            // counter++//test
            counterArray[i].incrementCounter()
        }) 
      })  
    });
    await once(rl, 'close');
    console.log('finished reading');
      // console.log(counter);//test
      let sortedArray = await sortArray(counterArray)
      let text = "";
      for (let i = 0; i < sortedArray.length; i++) {
        text += sortedArray[i].name + ": " + sortedArray[i].count + "\n"
      }

      writeToFile('./counted-names.txt', text)
      //[{name: counter}, {name: counter}]
      //"name: counter/n name:counter/n"
    } catch (err) {
      console.error(err);
    }
  }

  const sortArray = async (nameCounterArray:Array<NameCounter>)=>{
    let sortedArray = nameCounterArray.sort((nc1, nc2)=>{
      const count1 = nc1.count;
      const count2 = nc2.count;
      if(count1 > count2){return 1;}
      if(count1 < count2){return -1;}
      return 0;
    })
    return sortedArray;
  }

  const writeToFile = async (filePath: string, text: string)=>{
    try {
      await fs.writeFile(filePath, text); 
    } catch (error) {
      console.log(error)
    }
  }


  (async function fileToArray() {
    try {
      const rl = createInterface({
        input: createReadStream('first-names.txt'),
        crlfDelay: Infinity
      });
      rl.on('line', (line: string) => {
          let newCounter = new NameCounter(line);
          counterArray.push(newCounter);
        })
  
      await once(rl, 'close');

      countNames();

    } catch (err) {
      console.error(err);
    }
  })();


  //steps
  //1. learn typescript syntax
  //2. look up method to read file
  //3. count number of lines being read and check it matches up
  //4. search all oliver and check it matches how many are actually in file
  //5. recognised Oliver's, OLIVER, prefix and suffix was missed



  //decisions:

  //1. filter by capital first letter saves having to compare all letters in each word
  //2. not to remove each array that has length of 0 (saves having to find the length of each array)
  //3. realised that sometimes the first letter may not be a capital
  //4. regex cannot ignore case of name in text. Because names like Soon
  //5. changed regex so that Don't was not returned for Don but Don's would still be returned
  //6. Make faster