const checkboxContainer = document.getElementById("checkbox-container")
const projectContainer = document.getElementById("project-container")

let projectsData
let uniqueTags = []


function checkboxHTML(data) {
	// data = data.toLowerCase()
	return `<input type="checkbox" id="${data.replace(/\s/g, "-")}" name="${data}"/>${data}`
}
function cardHTML(data) {
	return `<strong>${data.title}</strong><p>${data.desc}</p><div class="tags-list"><span>${data.tags.join("</span><span>")}</span></div>`
	// return `<strong>${data.title}</strong><p>${data.desc}</p><div class="tags-list"><span>${data.tags.join("</span><span>").toLowerCase()}</span></div>`
}


function generateCheckboxes() {
	uniqueTags = [...new Set(projectsData.flatMap(project => project.tags))]

	uniqueTags.forEach(tag => {
		let label = document.createElement("label")
		label.innerHTML = checkboxHTML(tag)
		checkboxContainer.appendChild(label)
	})
}
function generateCards(data = projectsData) {
	data.forEach(project => {
		let card = document.createElement("a")
		card.href = project.url
		card.className = "card"
		card.innerHTML = cardHTML(project)

		projectContainer.appendChild(card)
	})
}


async function fetchProjects() {
	await fetch("/projects-data.json")
		.then(res => res.json())
		.then(json => projectsData = json.projects)

	init()
}
fetchProjects()

function init() {
	generateCheckboxes()
	generateCards()
	work()

	utilities()
}

function work() {
	const checkboxes = checkboxContainer.querySelectorAll("input[type=checkbox]")

	checkboxes.forEach(checkbox => {
		checkbox.onchange = () => {
			const selectedTags = [...checkboxContainer.querySelectorAll("input[type=checkbox]:checked")].map(input => input.name)

			projectContainer.innerHTML = ""

			if (selectedTags.length == 0) return generateCards()

			let newArray = []
			projectsData.forEach(project => {
				if (project.tags.some(tag => {return selectedTags.indexOf(tag) > -1})) {
					newArray.push(project)
				}
			})

			generateCards(newArray)
		}
	})
}


function utilities() {
	const sidebar = document.getElementById("sidebar")
	const sidebarButton = document.getElementById("sidebar-toggle")
	sidebarButton.onclick = () => {
		sidebar.classList.toggle("open")
	}

	const checkboxes = checkboxContainer.querySelectorAll("input[type=checkbox]")
	const checkboxButton = document.getElementById("checkbox-toggle")

	checkboxButton.onclick = () => {
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = false
			checkboxes[i].dispatchEvent(new Event("change"))
		}
	}
}