
wordWidth = 100
wordHeight = 20
levelHeight = (level) -> 2 + Math.pow(level, 1.8) * 10

window.drawTree = (svgElement, doc) ->
	svg = d3.select(svgElement)
	svg.attr('width', ()->wordWidth)
	.attr('height', ()->wordHeight * 2)
	.append('text').text(()->"Loading...")
	.attr('class', () -> "tag")
	.attr('x', ()->wordWidth/2)
	.attr('y', ()->wordHeight * 3/2)
	.attr('text-anchor', 'middle')

	conllData = await getDependencyParse(doc)
	data = parseConll(conllData)

	# compute edge levels
	edges = (item for item in data when item.id)
	for edge in edges
		for edge in edges
			edge.level = 1 + maximum(e.level for e in edges when under(edge, e))

	# compute height
	treeWidth = wordWidth*data.length
	treeHeight = levelHeight(maximum(edge.level for edge in data)) + 2 * wordHeight
	for item in data
		item.bottom = treeHeight - 1.8 * wordHeight
		item.top = item.bottom - levelHeight(item.level)
		item.left = item.id * wordWidth + (wordWidth/2)
		item.right = item.parent * wordWidth + (wordWidth/2)
		item.mid = (item.right+item.left)/2
		item.diff = (item.right-item.left)/4
		item.arrow = item.top + (item.bottom-item.top)*.25

	# draw svg
	svg.selectAll('text, path').remove()
	svg.attr('xmlns', 'http://www.w3.org/2000/svg')
	svg.attr('width', treeWidth).attr('height', treeHeight + wordHeight/2)

	words = svg.selectAll('.word').data(data).enter()
		.append('text')
		.text((d) -> d.word)
		.attr('class', (d) -> "word w#{d.id}")
		.attr('x', (d) -> wordWidth*d.id + (wordWidth/2))
		.attr('y', treeHeight-wordHeight)
		.on 'mouseover', (d) ->
			svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false)
			svg.selectAll('.tag').attr('opacity', 0)
			svg.selectAll(".w#{d.id}").classed('active', true)
			svg.select(".tag.w#{d.id}").attr('opacity', 1)
		.on 'mouseout', (d) ->
			svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false)
			svg.selectAll('.tag').attr('opacity', 0)
		.attr('text-anchor', 'middle')

	tags = svg.selectAll('.tag').data(data).enter()
		.append('text')
		.text((d) -> d.tag)
		.attr('class', (d) -> "tag w#{d.id}")
		.attr('x', (d) -> wordWidth*d.id + (wordWidth/2))
		.attr('y', treeHeight)
		.attr('opacity', 0)
		.attr('text-anchor', 'middle')
		.attr('font-size', '90%')

	edges = svg.selectAll('.edge').data(data).enter()
		.append('path')
		.filter((d) -> d.id)
		.attr('class', (d) -> "edge w#{d.id} w#{d.parent}")
		.attr('d', (d) -> "M#{d.left},#{d.bottom} C#{d.mid-d.diff},#{d.top} #{d.mid+d.diff},#{d.top} #{d.right},#{d.bottom}")
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1.5')

	dependencies = svg.selectAll('.dependency').data(data).enter()
		.append('text')
		.filter((d) -> d.id)
		.text((d) -> d.dependency)
		.attr('class', (d) -> "dependency w#{d.id} w#{d.parent}")
		.attr('x', (d) -> d.mid)
		.attr('y', (d) -> d.arrow - 7)
		.attr('text-anchor', 'middle')
		.attr('font-size', '90%')

	triangle = d3.svg.symbol().type('triangle-up').size(5)
	arrows = svg.selectAll('.arrow').data(data).enter()
		.append('path')
		.filter((d) -> d.id)
		.attr('class', (d) -> "arrow w#{d.id} w#{d.parent}")
		.attr('d', triangle)
		.attr('transform', (d) -> "translate(#{d.mid}, #{d.arrow}) rotate(#{if d.id < d.parent then '' else '-'}90)")
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1.5')


# functions
maximum = (array) -> Math.max 0, Math.max.apply(null, array);

under = (edge1, edge2) ->
	[mi, ma] = if edge1.id < edge1.parent then [edge1.id, edge1.parent] else [edge1.parent, edge1.id]
	edge1.id != edge2.id and edge2.id >= mi and edge2.parent >= mi and edge2.id <= ma and edge2.parent <= ma

parseConll = (conllData) ->
	data = []
	data.push id: 0, word: 'ROOT', tag: 'ROOT', level: 0
	for line in conllData.split('\n') when line
		[id, word, _, cpos, fpos, _, parent, dependency] = line.split('\t')
		tag = if cpos != fpos then cpos+' '+fpos else cpos
		data.push id: Number(id), word: word, tag: tag, parent: Number(parent), dependency: dependency, level: 1
	data

getDependencyParse = (doc) ->
	fetch('/',{
			method: "POST",
			body: JSON.stringify({ 
				doc: doc
			}),
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			}
	})
	.then (res) -> res.json()
	.then (body) -> body['body']