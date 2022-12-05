const checkboxContainer = document.getElementById("checkbox-container")
const projectContainer = document.getElementById("project-container")
const buttonContainer = document.getElementById("pagination-buttons")
const paginationInfo = document.getElementById("pagination-info")

let projectsData
let state = {
	array: [],
	currPage: 1,
	maxPage: 1,
	pageSize: 6
}

function setState(array) {
	state.array = array
	state.currPage = 1
	state.maxPage = Math.ceil(array.length / state.pageSize)
}


fetch("/projects-data.json")
.then(res => res.json())
.then(json => {
	projectsData = json.projects
	setState(projectsData)
	init()
	utilities()
})


function init() {
	pagination()

	uniqueTags = [...new Set(state.array.flatMap(project => project.tags))]
	uniqueTags.forEach(tag => {
		let label = document.createElement("label")
		label.innerHTML = `<input type="checkbox" id="${tag.replace(/\s/g, "-")}" value="${tag}"/>${tag}`
		checkboxContainer.appendChild(label)
	})

	const checkboxes = checkboxContainer.querySelectorAll("input[type=checkbox]")
	checkboxes.forEach(cb => {
		cb.onchange = () => {
			const selectedCB = [...checkboxContainer.querySelectorAll("input[type=checkbox]:checked")].map(input => input.value)

			if (selectedCB.length == 0) {
				setState(projectsData)
				pagination()
				return
			}

			const selectedProjects = projectsData.filter((project) =>
				project.tags.some((tag) => selectedCB.includes(tag))
			)
			setState(selectedProjects)
			pagination()
		}
	})
}


function pagination() {
	function renderCards() {
		projectContainer.innerHTML = ""

		let trimed = state.array.slice((state.currPage - 1) * state.pageSize, state.currPage * state.pageSize)
		trimed.forEach(project => {
			let card = document.createElement("a")
			card.href = project.url
			card.className = "card"
			card.innerHTML = `<strong>${project.title}</strong><p>${project.desc}</p><div class="tags-list"><span>${project.tags.join("</span><span>")}</span></div>`

			projectContainer.appendChild(card)
		})
	}
	renderCards()

	function renderButtons() {
		buttonContainer.innerHTML = ""

		const prevButton = document.createElement("button")
		prevButton.textContent = "←"
		prevButton.onclick = () => {
			state.currPage--
			renderCards()
			updateButtons()
				updateInfo()
		}
		buttonContainer.appendChild(prevButton)

		let currentButton
		let pageButtons = []
		for (let i = 1; i <= state.maxPage; i++) {
			const pageButton = document.createElement("button")
			pageButton.textContent = i
			pageButton.classList.add("page")
			if (i === 1) {
				pageButton.classList.add("active")
				currentButton = pageButton
			}
			pageButton.addEventListener("click", () => {
				state.currPage = i
				renderCards()
				updateButtons()
				updateInfo()
			})
			buttonContainer.appendChild(pageButton)
			pageButtons.push(pageButton)
		}

		const nextButton = document.createElement("button")
		nextButton.textContent = "→"
		nextButton.onclick = () => {
			state.currPage++
			renderCards()
			updateButtons()
				updateInfo()
		}
		buttonContainer.appendChild(nextButton)


		function updateButtons() {
			currentButton.classList.remove("active")
			pageButtons[state.currPage - 1].classList.add("active")
			currentButton = pageButtons[state.currPage - 1]

			if (state.currPage === 1) prevButton.disabled = true
			else prevButton.disabled = false
			if (state.currPage === state.maxPage) nextButton.disabled = true
			else nextButton.disabled = false
		}
		updateButtons()

		function updateInfo() {
			const startIndex = (state.currPage - 1) * state.pageSize + 1
			const endIndex = Math.min(state.currPage * state.pageSize, state.array.length)
			paginationInfo.textContent = `${startIndex}-${endIndex} of ${state.array.length} Projects`
		}
		updateInfo()
	}
	renderButtons()
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