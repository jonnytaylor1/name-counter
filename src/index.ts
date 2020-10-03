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
    incrementCounter(amount:number) {this._count+=amount}
  }

  let counterArray: Array<NameCounter> =[];

  //converts the first names file into an array of NameCounter instances
  const fileToArray = async (fileName: string)=> {
    return new Promise(async (resolve, reject)=>{
      try {
        // let counter: number = 0; //test
        const rl = createInterface({input: createReadStream(fileName)});
        rl.on('line', (line: string) => counterArray.push(new NameCounter(line)))

        await once(rl, 'close');
        resolve();
      } catch (err) {
        console.log(err);
        reject()
      }
    })};



  //counts the number of times each name appears in the txt file
  const countNames = async (fileName: string)=>{
    return new Promise(async (resolve, reject)=>{
      try {
        let rl = createInterface({input: createReadStream(fileName)});
        rl.on('line', (line: string) => {
          for (let i = 0; i < counterArray.length; i++) {          
            let name = counterArray[i].name;
            // let name = 'Harry' //test
            let uppercaseName = name.toUpperCase();
            let testName = '('+name+'|'+uppercaseName+')'
            // let re = new RegExp(testName);//test
            let re2 = new RegExp('(^|["\'_({\[-]+)'+testName+'([?,"_\)\}.;!:\\]-]|\'[sS]|$)');
            
            let lineArray: Array<string> = line.split(' ').filter(word=> re2.test(word) ? word:null);
            // let lineArray: Array<string> = line.split(' ').filter(word=> re.test(word) && !re2.test(word) ? word:null); //test
            counterArray[i].incrementCounter(lineArray.length)
  
              // console.log(word);//test
              // counter++//test
          }
      });
      await once(rl, 'close');
        // console.log(counter);//test
        resolve();
      } 
      catch (err) {console.log(err);}
    })
  }
   

  //sorts array ascending order
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

  //converts the NameCounter array to a string of name: count \n name: count /n...
  const arrayToString = (sortedArray: Array<NameCounter>)=>{
    return new Promise<string>((resolve, reject)=>{
      try{
        let text = "";
        for (let i = 0; i < sortedArray.length; i++) {
          text += sortedArray[i].name + ": " + sortedArray[i].count + "\n"
        }
        resolve(text)
    }
    catch(err){
      console.log(err)
      reject()
    }
    })
  }
    //writes the string to a txt file
    const writeToFile = async (filePath: string, text: string)=>{
      try {
        await fs.writeFile(filePath, text);
      } catch (error) {console.log(error)}
    }

  (async function () {
    try{
      console.log("reading names...");
      await fileToArray('first-names.txt')
      console.log("reading Oliver Twist...");
      await countNames('./oliver-twist.txt');
      console.log("manipulating data...");
      let sortedArray = await sortArray(counterArray)
      let text = await arrayToString(sortedArray);
      console.log("writing to txt file...");
      writeToFile('./counted-names.txt', text)
      console.log("complete");
    }
    catch (error){console.log(error);}
  })()