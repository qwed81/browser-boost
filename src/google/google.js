let elements = getSearchElements();
console.log(elements);

let highlighted;
highlight(0);
window.scrollTo({
	top: 0
});

let jumpList = {
	'u': 0,
	'i': 1,
	'o': 2,
	'p': 3,
	'8': 4,
	'9': 5,
	'0': 6,
};

document.body.addEventListener('keydown', (e) => {
	let key = e.key;
	// skip modified values
	if (key.ctrlKey == true || key.altKey == true) {
		return;
	}

	if (key == ' ') {
		e.preventDefault();
		applyLink(elements[highlighted]);
	} else if (key == 'j') {
		e.preventDefault();
		highlightNext();
	} else if (key == 'k') {
		e.preventDefault();
		highlightPrev();
	} else if (jumpList[key]) {
		e.preventDefault();
		highlightAndScroll(jumpList[key]);
	} 

});

// "generic" over lists and classList
function disjoint(classList1, classList2) {
	for (let className1 of classList1) {
		for (let className2 of classList2) {
			if (className1 == className2) {
				return false;
			}
		}
	}

	return true;
}

function getSearchElements() {
	let validParentClasses = ['V9qXjb', 'MjjYud', 'hlcw0c'];
	let topParent = document.getElementById('rso');
	
	let elems = [];
	for (let child of topParent.childNodes) {
		// it is not a valid class
		if (disjoint(child.classList, validParentClasses)) {
			continue;
		}

		let linkElements = child.querySelectorAll('a');
		for (let i = 0; i < linkElements.length; i++) {
			elems.push(linkElements[i]);
		}
	}
	
	return elems;
}

function highlight(index) {
	for (elem of elements) {
		elem.classList.remove('boost-selected');
	}

	let element = elements[index];
 	element.classList.add('boost-selected');
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

function applyLink(link) {
	window.location.href = link.href;
}

