let elements = getSearchElements();
let highlighted;
highlight(0);
window.scrollTo({
	top: 0
});

function getSearchElements() {
	let validClasses = ['V9qXjb', 'MjjYud', 'hlcw0c'];
	let topParent = document.getElementById('rso');
	let elems = [];
	for (let child of topParent.childNodes) {
		for (let className of validClasses) {
			if (child.classList.contains(className)) {
				elems.push(child);
				break;
			}
		}
	}
	
	return elems;
}

const selected = 'boost-selected';

function highlight(index) {
	for (elem of elements) {
		elem.classList.remove('boost-selected');
	}

	let element = elements[index];
 	element.classList.add(selected);
	highlighted = index;
}

function highlightAndScroll(index) {
	highlight(index);
	scrollToCenter(elements[index]);
}

function scrollToCenter(element) {
	let elementMid = (element.getBoundingClientRect().bottom + element.getBoundingClientRect().top) / 2 
	let scrollTo = elementMid - window.innerHeight / 2 + window.scrollY;

	window.scrollTo({
		top: scrollTo,
		behavior: "auto"
	});
}

function highlightNext() {
	highlighted += 1;
	highlightAndScroll(highlighted);
}

function highlightPrev() {
	highlighted -= 1;

	if (highlighted < 0) {
		highlighted = 0;
		window.scrollTo({
			top: 0
		});
	}
	else {
		highlightAndScroll(highlighted);
	}
}

function applyLink(element) {
	const link = element.querySelector('a');
	window.location.href = link.href;
}

document.body.addEventListener('keydown', (e) => {
	let key = e.key;
//	console.log(key);

	// skip modified values
	if (key.ctrlKey == true || key.altKey == true) {
		return;
	}

	if (key == 'j') {
		e.preventDefault();
		highlightNext();
	}
	else if (key == 'k') {
		e.preventDefault();
		highlightPrev();
	}
	else if (key == 'u') {
		e.preventDefault();
		highlightAndScroll(0);
	}
	else if (key == 'i') {
		e.preventDefault();
		highlightAndScroll(1);
	}
	else if (key == 'o') {
		e.preventDefault();
		highlightAndScroll(2);
	}
	else if (key == 'p') {
		e.preventDefault();
		highlightAndScroll(3);
	}
	else if (key == ' ') {
		e.preventDefault();
		applyLink(elements[highlighted]);
	}
});
