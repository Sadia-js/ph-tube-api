
const people = [
  { name: 'Alice', age: '25years' },
  { name: 'Bob', age: '30years' },
  { name: 'Charlie', age: '20.5years' }
];

const extractNumbs = (age) => {
    const digits = age.match(/\d+/)[0];
    const number = Number(digits);
    // console.log(digits)
    return(number)
}

people.sort((a,b)=> extractNumbs(a.age) - extractNumbs(b.age))
console.log(people)