const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');


//count occurences
// [{name: count}, {name:count}]
class NameCounter {
    private _name: string;
    private _count: number = 0;

    constructor(name: string) {this._name = name;}

    get name(): string {return this._name;}
    get count(): number {return this._count;}

    incrementCounter() {this._count++}
  }


  let counterArray: Array<NameCounter> = []


  const fileReader =()=>{  
    let lineReaderText = require('readline').createInterface({
      input: require('fs').createReadStream('./oliver-twist.txt')
    });
    lineReaderText.on('line', function (line: string) {
      counterArray.forEach((nameCounter, i)=>{
        // if(i==0){
        let name = nameCounter.name;
        // let name = 'Andrew'
        let uppercaseName = name.toUpperCase();
        let testVariable = '('+name+'|'+uppercaseName+')'

        // let re = new RegExp(testVariable);
        let re2 = new RegExp('^(.*[\W\'\"(\-_]+)?'+testVariable+'([\W\'\")_,!?\.;:\-]+.*)?$');
        let lineArray: Array<string> = line.split(' ').filter(word=> re2.test(word) ? word:null);
        // let lineArray: Array<string> = line.split(' ').filter(word=> re.test(word) && !re2.test(word) ? word:null);
        lineArray.forEach(word=>{
          if(word!=="Don't")
          // console.log(word);
          counterArray[i].incrementCounter()
        })
      // } 
      })  
    });
    lineReaderText.on('close', () => {
      // console.log('finished');
      let sortedArray = counterArray.sort((nc1, nc2)=>{
        const count1 = nc1.count;
        const count2 = nc2.count;
        if(count1 > count2){return 1;}
        if(count1 < count2){return -1;}
        return 0;
      })
      sortedArray.forEach((nameCounter) => {
        let name = nameCounter.name;
        let countTotal = nameCounter.count;
          console.log(name+": "+ countTotal);
      });
    })
  }  


  (async function processLineByLine() {
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

      fileReader();

    } catch (err) {
      console.error(err);
    }
  })();

  
  // sort the array based on the count property


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


//1. Todo
//1. make regex as specific as possible
//2. test with other names and make sure there are no additional parts of regex that should be added

//18000 words
//100 names

//either check each word 100 times
//check each name 18000 times