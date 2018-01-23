let parser = N3.Parser();
let preparsed = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dc: 'http://purl.org/dc/elements/1.1/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
}
preparsed[''] = "#";

let resources = [
  [':Task','rdfs:subClassOf','rdfs:Class'],
  [':List','rdfs:subClassOf',':Task'],
  [':Filter','rdfs:subClasSOf','rdfs:Class'],
  [':due','rdfs:domain',':Task'],
  [':due','rdfs:range','xsd:date'],
  [':created','rdfs:domain',':Task'],
  [':created','rdfs:range','xsd:dateTime'],
  [':status','rdfs:domain',':Task'],
  [':status','rdfs:range',':Status'],
  [':updated','rdfs:domain',':Status'],
  // wanted this to be "time or datetime" but there is no common superclass
  [':updated','rdfs:domain','rdfs:Literal'],
  [':SubTasks','rdfs:subClassOf','rdf:Seq'],
  [':hasSubTasks','rdfs:domain',':Task'],
  [':hasSubTasks','rdfs:range',':SubTasks'],
  [':Tag','rdfs:subClassOf','rdfs:Class'],
  [':tagged','rdfs:domain',':Task'],
  [':tagged','rdfs:range',':Tag'],
  [':repeats','rdfs:domain',':Task'],
  [':repeats','rdfs:range','rdfs:Literal'],
  [':foo','rdf:type',':Task'],
  [':foo',':status',':bar'],
  [':foo',':status',':baz'],
  [':bar','rdfs:value','"complete"'],
  [':baz','rdfs:value','"5"']
];

let tutprefixes = {
  vCard: "http://www.w3.org/2001/vcard-rdf/3.0#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
}
tutprefixes[""]="#";
let tutdata =`
@prefix vCard:   <http://www.w3.org/2001/vcard-rdf/3.0#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix :        <#> .

<http://somewhere/MattJones/>
    vCard:FN    "Matt Jones" ;
    vCard:N     [ vCard:Family
                              "Jones" ;
                  vCard:Given
                              "Matthew"
                ] .

<http://somewhere/RebeccaSmith/>
    vCard:FN    "Becky Smith" ;
    vCard:N     [ vCard:Family
                              "Smith" ;
                  vCard:Given
                              "Rebecca"
                ] .

<http://somewhere/JohnSmith/>
    vCard:FN    "John Smith" ;
    vCard:N     [ vCard:Family
                              "Smith" ;
                  vCard:Given
                              "John"
                ] .

<http://somewhere/SarahJones/>
    vCard:FN    "Sarah Jones" ;
    vCard:N     [ vCard:Family
                              "Jones" ;
                  vCard:Given
                              "Sarah"
                ] .
`;

// let triples = parser.parse(tutdata);
// console.log(triples);
// let writer = N3.Writer({prefixes: tutprefixes});
// writer.addTriples(triples);

let writer = N3.Writer({prefixes: preparsed});
writer.addTriples(resources.map(([subj, pred, obj]) => ({subject: subj, predicate: pred, object: obj})));


let turtle;
writer.end((e,r)=>console.log(turtle=r));
console.log(turtle);


let store;
rdfstore.create(function(e,s) {
	store = s; 
  graph = store.rdf.createGraph();
  store.registerDefaultProfileNamespaces();
  store.rdf.setPrefix('',"");
});

rdfstore.create((e,s)=>{
  s.load("text/turtle",turtle,()=>{
    s.graph((e,g)=> {
      store.insert(g);
    });
  }); 
});

//alright, so it can't reason
// but it can do queries.
function query() {
  store.execute(
    'PREFIX : <#> \
    SELECT ?x ?y \
    WHERE { ?x rdf:type :Task .\
            ?x :status ?y .\
            ?y rdfs:value "complete" .}'
    ,(err,res)=>{
      console.log("results...");
      console.log(res);
  });
}