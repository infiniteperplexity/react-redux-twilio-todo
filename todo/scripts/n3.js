// welcome to callback hell
let parser = N3.Parser();
let preparsed = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dc: 'http://purl.org/dc/elements/1.1/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
}
preparsed[''] = "#";
let nstore = N3.Store({prefixes: preparsed});
let writer = N3.Writer({prefixes: preparsed});
// these honestly do nothing without a SPARQL parser
// let resources = [
//   [':Task','rdfs:subClassOf','rdfs:Class'],
//   [':List','rdfs:subClassOf',':Task'],
//   [':Filter','rdfs:subClasSOf','rdfs:Class'],
//   [':due','rdfs:domain',':Task'],
//   [':due','rdfs:range','xsd:date'],
//   [':created','rdfs:domain',':Task'],
//   [':created','rdfs:range','xsd:dateTime'],
//   [':status','rdfs:domain',':Task'],
//   [':status','rdfs:range',':Status'],
//   [':updated','rdfs:domain',':Status'],
//   // wanted this to be "time or datetime" but there is no common superclass
//   [':updated','rdfs:domain','rdfs:Literal']
//   [':SubTasks','rdfs:subClassOf','rdf:Seq'],
//   [':hasSubTasks','rdfs:domain',':Task'],
//   [':hasSubTasks','rdfs:range',':SubTasks'],
//   [':Tag','rdfs:subClassOf','rdfs:Class'],
//   [':tagged','rdfs:domain',':Task'],
//   [':tagged','rdfs:range',':Tag'],
//   [':repeats','rdfs:domain',':Task'],
//   [':repeats','rdfs:range','rdfs:Literal']
// ];

// let resources = [
//   [':$Root','a',':List'],
//   // The dynamic list of all lists
//   [':$List','a',':List'],
//   // The dynamic list of all untagged tasks
//   [':$Inbox','a',':List'],
//   // The dynamic list of all repeating tasks
//   [':$Repeating','a',':List'],
//   // The dynamic list of all completed, non-repeating tasks
//   [':$Completed','a',':List'],
//   // The dynamic list of all incomplete, non-repeating tasks
//   [':$Incomplete','a',':List'],
//   // A list of all tags...wait, but if tags aren't tasks, then it wouldn't work like that
//   [':$Tags','a',':List'],
//   // A tag you can attach to one and only one list
//   [':$Home','a',':Tag']
// ];
// nstore.addTriples(resources.map(([subj, pred, obj]) => ({subject: subj, predicate: pred, object: obj})));
writer.addTriples(nstore.getTriples());
writer.end((err, res)=>(console.log(res)));