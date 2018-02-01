// create a triplestore with commonly-used prefixes
let prefixes = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix : <#> .
`;
let preparsed = {
	rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
	owl: 'http://www.w3.org/2002/07/owl#',
	dc: 'http://purl.org/dc/elements/1.1/',
	xsd: 'http://www.w3.org/2001/XMLSchema#',
}
preparsed[''] = "#";

let store = N3.Store({prefixes: preparsed});

// add triples representing the app-specific Resources
store.addTriple(':Task','rdfs:subClassOf','rdfs:Class');
store.addTriple(':isDueOn','rdfs:domain',':Task');
store.addTriple(':isDueOn','rdfs:range','xsd:date');
store.addTriple(':created','rdfs:domain',':Task');
store.addTriple(':created','rdfs:range','xsd:date');
store.addTriple(':isComplete','rdfs:domain',':Task');
store.addTriple(':isComplete','rdfs:range','xsd:boolean');
store.addTriple(':SubTasks','rdfs:subClassOf','rdf:Seq');
store.addTriple(':hasSubTasks','rdfs:domain',':Task');
store.addTriple(':hasSubTasks','rdfs:range',':SubTasks');
store.addTriple(':TaskTag','rdfs:subClassOf','rdfs:Class');
store.addTriple(':taggedAs','rdfs:domain',':Task');
store.addTriple(':taggedAs','rdfs:range',':TaskTag');
// add disjoint priorities?

let writer = N3.Writer({prefixes: preparsed});

console.log(store.getTriples());
writer.addTriples(store.getTriples());
writer.end((e,r)=>console.log(r));