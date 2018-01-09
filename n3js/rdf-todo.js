// welcome to callback hell
let store;
rdfstore.create(function(e,s) {
	store = s; 
});
var graph = store.rdf.createGraph();
// unclear whether this is required
store.registerDefaultProfileNamespaces();
 
store.rdf.setPrefix('', '#');
graph.add(
	store.rdf.createTriple(
		store.rdf.createNamedNode(
			store.rdf.resolve(":Alice")
		),
        store.rdf.createNamedNode(
        	store.rdf.resolve("foaf:name")
        ),
        store.rdf.createLiteral("Alice")
    )
);
graph.add(
	store.rdf.createTriple(
		store.rdf.createNamedNode(
			store.rdf.resolve(":Jill")
		),
        store.rdf.createNamedNode(
        	store.rdf.resolve("foaf:name")
        ),
        store.rdf.createLiteral("Jill")
    )
);
var triples = graph.match(
	null,
	store.rdf.createNamedNode(
		store.rdf.resolve("foaf:name")
	),
	null
).toArray();

console.log(store.rdf.resolve(":Alice"));


// // // creates three triples, with his name, age, and homepage
// jsonld = {
//           "@context":
//           {
//              "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//              "xsd": "http://www.w3.org/2001/XMLSchema#",
//              "name": "http://xmlns.com/foaf/0.1/name",
//              "age": {"@id": "http://xmlns.com/foaf/0.1/age", "@type": "xsd:integer" },
//              "homepage": {"@id": "http://xmlns.com/foaf/0.1/homepage", "@type": "xsd:anyURI" },
//              "ex": "http://example.org/people/"
//           },
//           "@id": "ex:john_smith",
//           "name": "John Smith",
//           "age": "41",
//           "homepage": "http://example.org/home/"
//         };
// store.setPrefix("ex", "http://example.org/people/");
// store.load("application/ld+json", jsonld, function(err,results) {
// 	store.node("ex:john_smith", function(err, graph) {
// 		console.log(graph.toNT());
// 	});
// });
// store.setPrefix("ex", "http://example.org/people/");

// let ts =
// `
// <http://example.org/people/john_smith> <http://xmlns.com/foaf/0.1/age> "41"^^<http://www.w3.org/2001/XMLSchema#integer> . 
// <http://example.org/people/john_smith> <http://xmlns.com/foaf/0.1/homepage> "http://example.org/home/"^^<http://www.w3.org/2001/XMLSchema#anyURI> . 
// <http://example.org/people/john_smith> <http://xmlns.com/foaf/0.1/name> "John Smith"^^<http://www.w3.org/2001/XMLSchema#string> . 
// `
// ;
// let ts = `
// :Task rdf:type rdfs:Class .
// :isDueOn rdfs:domain x:Task ;
// 	rdfs:range xsd:date .
// :isComplete rdfs:domain :Task ;
// 	rdfs:range xsd:boolean .
// `;

let ts = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix dc: <http://purl.org/dc/elements/1.1/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix : <#>.

:Task rdfs:subClassOf rdfs:Class.
:isDueOn rdfs:domain :Task;
    rdfs:range xsd:date.
:created rdfs:domain :Task;
    rdfs:range xsd:date.
:isComplete rdfs:domain :Task;
    rdfs:range xsd:boolean.
:SubTasks rdfs:subClassOf rdf:Seq.
:hasSubTasks rdfs:domain :Task;
    rdfs:range :SubTasks.
:TaskTag rdfs:subClassOf rdfs:Class.
:taggedAs rdfs:domain :Task;
    rdfs:range :TaskTag.
`;
