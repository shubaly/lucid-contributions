/**
 *
 */

import Sigma from "sigma";
import Papa from "papaparse";
import Graph from "graphology";
import circular from "graphology-layout/circular";
import forceAtlas2 from "graphology-layout-forceatlas2";

function titleCase(str: string) {
    str = str.replace('  ', ' ')
    return str.toLowerCase().split(' ').map(function (word: string) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

// TODO make this dynamic based on the field mapping
Papa.parse<{ Recipient: string; Contributorname: string; PoliticalPartyofRecipient: string, ContributorPostalcode: string, Monetaryamount: number }>("./data.csv", {
    download: true,
    header: true,
    delimiter: ",",
    transformHeader: function (h) {
        return h.replace(/\s/g, '')
    },
    complete: (results) => {
        const graph: Graph = new Graph();

        // 2. Build the bipartite graph:
        results.data.forEach((line) => {
            const contributor = titleCase(line.Contributorname);
            const contributor_info = line.ContributorPostalcode;
            const recipient = titleCase(line.Recipient);
            const contribution_value = line.Monetaryamount
            const recipient_party = titleCase(line.PoliticalPartyofRecipient);

            if (!graph.hasNode(contributor)) {
                graph.addNode(contributor, {
                    nodeType: "contributor",
                    label: [contributor, contributor_info].filter((s) => !!s).join(" - "),
                });
            }

            if (!graph.hasNode(recipient)) {
                graph.addNode(recipient, {
                    nodeType: "recipient",
                    label: recipient,
                });
            }

            if (!graph.hasNode(recipient_party)) {
                graph.addNode(recipient_party, {
                    nodeType: "recipient_party",
                    label: recipient_party,
                });
            }

            // TODO ensure no duplicate edges in the pre-processing above
            graph.addDirectedEdge(contributor, recipient, {
                weight: 5,
                label: contribution_value
            });

            // FIXME what if recipient and recipient_party are the same?
            if (!graph.hasDirectedEdge(recipient, recipient_party)) {
                graph.addDirectedEdge(recipient, recipient_party, {
                    weight: 5
                });

            }
        });

        // 4. Add colors to the nodes, based on node types:
        const COLORS: Record<string, string> = {
            contributor: "#FA5A3D",
            recipient: "#5A75DB",
            recipient_party: "#7DF60D"
        };
        graph.forEachNode((node, attributes) =>
            graph.setNodeAttribute(node, "color", COLORS[attributes.nodeType as string]),
        );


        // Calculate degrees
        graph.forEachNode((node) => {
            const degree = graph.degree(node);
            graph.setNodeAttribute(node, 'degree', degree);

            // calculate party nodes' degree differently, sum of all degrees
            if (graph.getNodeAttribute(node, 'nodeType') == 'recipient_party') {
                let party_degree = 0;
                graph.forEachNeighbor(node, function (neighbor, attributes) {
                    party_degree += graph.degree(neighbor);
                });
                graph.setNodeAttribute(node, 'degree', party_degree);
            }
        });


        // Use degrees for node sizes:
        const degrees = graph.nodes().map((node) => graph.getNodeAttribute(node, 'degree'));
        const minDegree = Math.min(...degrees);
        const maxDegree = Math.max(...degrees);
        const minSize = 2, maxSize = 50;

        graph.forEachNode((node) => {
            const degree = graph.getNodeAttribute(node, 'degree');

            graph.setNodeAttribute(
                node,
                "size",
                minSize + ((degree - minDegree) / (maxDegree - minDegree)) * (maxSize - minSize),
            );
        });

        // 6. Position nodes on a circle, then run Force Atlas 2 for a while to get
        //    proper graph layout:
        circular.assign(graph);
        const settings = forceAtlas2.inferSettings(graph);
        forceAtlas2.assign(graph, {settings, iterations: 600});

        // 7. Hide the loader from the DOM:
        const loader = document.getElementById("loader") as HTMLElement;
        loader.style.display = "none";

        // 8. Finally, draw the graph using sigma:
        const container = document.getElementById("sigma-container") as HTMLElement;
        new Sigma(graph, container);
    },
});
