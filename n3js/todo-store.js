let store = N3.Store();
store.addTriple('http://ex.org/Pluto',  'http://ex.org/type', 'http://ex.org/Dog');
store.addTriple('http://ex.org/Mickey', 'http://ex.org/type', 'http://ex.org/Mouse');

let mickey = store.getTriples('http://ex.org/Mickey', null, null)[0];
console.log(mickey);
console.log(mickey.subject, mickey.predicate, mickey.object, '.');

let writer = N3.Writer();

writer.addTriple(mickey);
writer.end((e,r)=>console.log(r));

let parser = N3.Parser();

let prefixes = `
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> 
@prefix : <#> .
`;


// okay...so for now, let's play around purely on the back end.