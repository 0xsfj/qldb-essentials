const qldb = require('qldb').default;
const ionize = require('qldb').ionize;

const QuantumClient = new qldb({
  accessKey:"",
  secretKey:"",
  region:"",
  ledger:"",
});
async function main(){
// Later in your code
const movie = { Name: 'Terminator2', Rating: '8.4', Rank: 33, Producer: "Gale Ann Hurd" };
const query = await QuantumClient.execute("DELETE FROM Movies AS m WHERE m.Producer = 'Christopher Nolan'");
console.log(query)
}
main()
