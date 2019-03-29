/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

let item, edge;
const wordWidth = 100;
const wordHeight = 20;
const levelHeight = level => 2 + (Math.pow(level, 1.8) * 10);

window.drawTree = async function(svgElement, doc) {
	let arrows;
	const svg = d3.select(svgElement);
	svg.attr('width', ()=> wordWidth)
	.attr('height', ()=> wordHeight * 2)
	.append('text').text(()=> "Loading...")
	.attr('class', () => "tag")
	.attr('x', ()=> wordWidth/2)
	.attr('y', ()=> (wordHeight * 3)/2)
	.attr('text-anchor', 'middle');

	const conllData = await getDependencyParse(doc);
	const data = parseConll(conllData);

	// compute edge levels
	let edges = ((() => {
		const result = [];
		for (item of Array.from(data)) { 	
			if (item.id) {
				result.push(item);
			}
		}
		return result;
	})());
	for (edge of Array.from(edges)) {
		for (edge of Array.from(edges)) {
			edge.level = 1 + maximum((() => {
				const result1 = [];
				for (let e of Array.from(edges)) {
					if (under(edge, e)) {
						result1.push(e.level);
					}
				}
				return result1;
			})());
		}
	}

	// compute height
	const treeWidth = wordWidth*data.length;
	const treeHeight = levelHeight(maximum((() => {
		const result2 = [];
		for (edge of Array.from(data)) {
			result2.push(edge.level);
		}
		return result2;
	})())) + (2 * wordHeight);
	for (item of Array.from(data)) {
		item.bottom = treeHeight - (1.8 * wordHeight);
		item.top = item.bottom - levelHeight(item.level);
		item.left = (item.id * wordWidth) + (wordWidth/2);
		item.right = (item.parent * wordWidth) + (wordWidth/2);
		item.mid = (item.right+item.left)/2;
		item.diff = (item.right-item.left)/4;
		item.arrow = item.top + ((item.bottom-item.top)*.25);
	}

	// draw svg
	svg.selectAll('text, path').remove();
	svg.attr('xmlns', 'http://www.w3.org/2000/svg');
	svg.attr('width', treeWidth).attr('height', treeHeight + (wordHeight/2));

	const words = svg.selectAll('.word').data(data).enter()
		.append('text')
		.text(d => d.word)
		.attr('class', d => `word w${d.id}`)
		.attr('x', d => (wordWidth*d.id) + (wordWidth/2))
		.attr('y', treeHeight-wordHeight)
		.on('mouseover', function(d) {
			svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false);
			svg.selectAll('.tag').attr('opacity', 0);
			svg.selectAll(`.w${d.id}`).classed('active', true);
			return svg.select(`.tag.w${d.id}`).attr('opacity', 1);
	}).on('mouseout', function(d) {
			svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false);
			return svg.selectAll('.tag').attr('opacity', 0);
		}).attr('text-anchor', 'middle');

	const tags = svg.selectAll('.tag').data(data).enter()
		.append('text')
		.text(d => d.tag)
		.attr('class', d => `tag w${d.id}`)
		.attr('x', d => (wordWidth*d.id) + (wordWidth/2))
		.attr('y', treeHeight)
		.attr('opacity', 0)
		.attr('text-anchor', 'middle')
		.attr('font-size', '90%');

	edges = svg.selectAll('.edge').data(data).enter()
		.append('path')
		.filter(d => d.id)
		.attr('class', d => `edge w${d.id} w${d.parent}`)
		.attr('d', d => `M${d.left},${d.bottom} C${d.mid-d.diff},${d.top} ${d.mid+d.diff},${d.top} ${d.right},${d.bottom}`)
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1.5');

	const dependencies = svg.selectAll('.dependency').data(data).enter()
		.append('text')
		.filter(d => d.id)
		.text(d => d.dependency)
		.attr('class', d => `dependency w${d.id} w${d.parent}`)
		.attr('x', d => d.mid)
		.attr('y', d => d.arrow - 7)
		.attr('text-anchor', 'middle')
		.attr('font-size', '90%');

	const triangle = d3.svg.symbol().type('triangle-up').size(5);
	return arrows = svg.selectAll('.arrow').data(data).enter()
		.append('path')
		.filter(d => d.id)
		.attr('class', d => `arrow w${d.id} w${d.parent}`)
		.attr('d', triangle)
		.attr('transform', d => `translate(${d.mid}, ${d.arrow}) rotate(${d.id < d.parent ? '' : '-'}90)`)
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1.5');
};


// functions
var maximum = array => Math.max(0, Math.max.apply(null, array));

var under = function(edge1, edge2) {
	const [mi, ma] = edge1.id < edge1.parent ? [edge1.id, edge1.parent] : [edge1.parent, edge1.id];
	return (edge1.id !== edge2.id) && (edge2.id >= mi) && (edge2.parent >= mi) && (edge2.id <= ma) && (edge2.parent <= ma);
};

var parseConll = function(conllData) {
	const data = [];
	data.push({id: 0, word: 'ROOT', tag: 'ROOT', level: 0});
	for (let line of Array.from(conllData.split('\n'))) {
		if (line) {let _, cpos, dependency, fpos, id, parent, word;
		
			[id, word, _, cpos, fpos, _, parent, dependency] = line.split('\t');
			const tag = cpos !== fpos ? cpos+' '+fpos : cpos;
			data.push({id: Number(id), word, tag, parent: Number(parent), dependency, level: 1});
		}
	}
	return data;
};

var getDependencyParse = doc =>
	fetch('/',{
			method: "POST",
			body: JSON.stringify({ 
				doc
			}),
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			}
	})
	.then(res => res.json())
	.then(body => body['body'])
;