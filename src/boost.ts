function setLinkIdentifierStyle(elem: HTMLElement) {
	elem.style.position = 'absolute';
	elem.style.backgroundColor = 'blue';
	elem.style.zIndex = '1000';
	elem.style.fontSize = '15px';
	elem.style.fontWeight = 'bold';
	elem.style.borderRadius = '5px';
	elem.style.padding = '5px';
}

// these two should be the same length
const left = ['f', 'a', 's', 'd', 'e', 'r', 't', 'q', 'v', 'c'] as const;
const right = ['h', 'j', 'k', 'l', 'u', 'i', 'o', 'n', 'b', 'p'] as const;
if (left.length != right.length) {
	throw new Error('Key arrays are not the same length');
}

function generateName(index: number) {
	if (index == 0) {
		return 'h';
	}

	let nextIsRight = true;
	let output = '';
	let len = left.length;
	while (index > 0) {
		if (nextIsRight) {
			output = right[index % len] + output;
		} else {
			output = left[index % len] + output;
		}
		index = Math.floor(index / len);
		nextIsRight = !nextIsRight;
	}

	return output;
}

let elemCache: Map<HTMLElement, HTMLElement> = new Map();
let nameMap: Map<string, HTMLElement> = new Map();
let currentGenerationIndex = 0;

// root element for search fields
let root = document.createElement('div');
root.style.display = 'none';
root.id = 'boost-search-root';
document.body.append(root);

// status bar
let statusBar = document.createElement('div');
statusBar.id = 'boost-status-bar';
statusBar.style.zIndex = '1000';
statusBar.style.width = '30%';
statusBar.style.height = '1.5px';
statusBar.style.position = 'fixed';
statusBar.style.bottom = '0';
statusBar.style.left = '50%';
statusBar.style.transform = 'translateX(-50%)';
statusBar.style.backgroundColor = 'blue';
document.body.append(statusBar);

function setStatusBarState(active: boolean) {
	let statusBar = document.getElementById('boost-status-bar');
	if (active) {
		statusBar.style.backgroundColor = 'blue';
	} else {
		statusBar.style.backgroundColor = 'transparent';
	}
}

function getLinks() {
	let elements = document.getElementsByTagName('a');
	
	for (let i = 0; i < elements.length; i += 1) {
		let elem = elements[i];

		let rect = elem.getBoundingClientRect();
		let cachedElem: HTMLElement | null = elemCache.get(elem); 
		if (cachedElem == null) {
			let newElem = document.createElement('div');
			setLinkIdentifierStyle(newElem);
			newElem.style.left = `${rect.x + window.scrollX}px`;
			newElem.style.top = `${rect.y + window.scrollY}px`;

			let name = generateName(currentGenerationIndex);
			newElem.innerText = name;
			currentGenerationIndex += 1;
			nameMap.set(name, elem);

			root.appendChild(newElem);
			elemCache.set(elem, newElem);
		} else {
			cachedElem.style.left = `${rect.x + window.scrollX}px`;
			cachedElem.style.top = `${rect.y + window.scrollY}px`;
		}
	}
}

let searching = false;
let searchedText ='';

function stopSearching() {
	searching = false;
	searchedText = '';
	root.style.display = 'none';
}

function handleKeyDown(e: KeyboardEvent) {
	// ctrl + / to blur the element (and select the body)
	if (e.key == '/' && e.ctrlKey) {
		(e.target as HTMLElement).blur();
		e.preventDefault();
	}

	// ctrl + ' to start searching
	if (e.key == '\'' && e.ctrlKey && searching == false) {
		root.style.display = 'block';
		e.preventDefault();
		getLinks();
		searching = true;
		return;
	} else if (e.key == 'Escape' && searching == true) { // esc to stop searching
		e.preventDefault();
		stopSearching();
		return;
	}

	if (searching) {
		// all control keys start with upper case, so we can just ignore them
		if (e.key[0] >= 'a' && e.key[0] <= 'z') {
			searchedText += e.key[0];
		}

		let selectedElement = nameMap.get(searchedText);
		if (selectedElement != null) {
			let href = selectedElement.getAttribute('href');
			if (href) {
				stopSearching();
				window.location.href = href;
			}
		}

		e.preventDefault();
	}
}

let lastKeyG = false;
function documentKeyDown(e: KeyboardEvent) {
	if (searching) {
		return;
	}

	if (e.target != document.body) {
		return;
	}

	if (e.key == 'j') { // scroll down by 200px
		window.scrollBy(0, 200); 
		e.preventDefault();
	} else if (e.key == 'k') { // scroll up by 200px
		window.scrollBy(0, -200);
		e.preventDefault();
	} else if (e.key == 'g') { // scroll to the top of the page
		if (lastKeyG == false) { // to allow gg to be pressed
			lastKeyG = true;
			return;
		} else {
			window.scroll(0, 0);
		}
	} else if (e.key == 'G') { // scroll to the bottom of the page
		window.scroll(0, document.body.scrollHeight);
	}

	lastKeyG = false;
}

// runs on all presses and checks if it should intercept the press
document.body.addEventListener('keydown', handleKeyDown, true);

// runs when the body of the document is selected
document.body.addEventListener('keydown', documentKeyDown);

// run in the background so if searching update the position of
// all of the items as well as change status bar
let last_active: Element | null = null;
setInterval(() => {
	if (!searching && document.activeElement == last_active) {
		return;
	}

	last_active = document.activeElement;
	setStatusBarState(last_active == document.body);
	getLinks();
}, 50);

