{
	('use strict');

	const select = {
		templateOf: {
			book: '#template-book',
		},
		containerOf: {
			booksList: '.books-list',
			filters: '.filters',
		},
		book: {
			image: '.book__image',
			bookId: 'data-id',
			rating: '.book__rating__fill',
		},
	};

	const classNames = {
		favorite: 'favorite',
	};

	const templates = {
		books: Handlebars.compile(
			document.querySelector(select.templateOf.book).innerHTML
		),
	};

	function render() {
		for (let book of dataSource.books) {
			const ratingBgc = determineRatingBgc(book.rating);
			const ratingWidth = ratingBgc * 10;
			book.ratingBgc = ratingBgc;
			book.ratingWidth = ratingWidth;

			const generatedHTML = templates.books(book);
			const generatedDOM = utils.createDOMFromHTML(generatedHTML);
			const menuContainer = document.querySelector(
				select.containerOf.booksList
			);
			menuContainer.appendChild(generatedDOM);
		}
	}

	const favoriteBooks = [];
	const filters = [];

	function initActions() {
		const books = document.querySelector(select.containerOf.booksList);
		books.addEventListener('click', function (event) {
			event.preventDefault();
		});

		books.addEventListener('dblclick', function (event) {
			event.preventDefault();

			const bookId = event.target.offsetParent.getAttribute(select.book.bookId);
			//const favoriteIndex = favoriteBooks.indexOf(bookId);

			if (!favoriteBooks.includes(bookId)) {
				event.target.offsetParent.classList.add(classNames.favorite);
				favoriteBooks.push(bookId);
			} else {
				event.target.offsetParent.classList.remove(classNames.favorite);
				favoriteBooks.pop(bookId); //UWAGA!! sprawdzić czy pop działa poprawnie
				//favoriteBooks.splice(favoriteIndex, 1);
			}
		});
		//console.log('favoriteBooks arr', favoriteBooks);

		//books.addEventListener('click', function(event) {
		//  event.preventDefault();
		//});

		const form = document.querySelector(select.containerOf.filters);

		form.addEventListener('click', function (event) {
			//event.preventDefault();

			const filter = event.target;
			const value = event.target.value;

			if (
				filter.tagName == 'INPUT' &&
				filter.type == 'checkbox' &&
				filter.name == 'filter'
			) {
				console.log('filter.value', value);
				const checked = event.target.checked;
				if (checked) {
					filters.push(value);
				} else {
					filters.pop(value);
				}
				console.log('filters arr', filters);
			}
			filterBooks();
		});
	}

	function filterBooks() {
		for (let book of dataSource.books) {
			let shouldBeHidden = false;
			const selected = document.querySelector(
				'.book__image[data-id="' + book.id + '"]'
			);

			for (const filter of filters) {
				if (!book.details[filter]) {
					shouldBeHidden = true;
					break;
				}
			}

			if (shouldBeHidden == true) {
				selected.classList.add('hidden');
			} else {
				selected.classList.remove('hidden');
			}
			console.log(selected);
		}
	}

	function determineRatingBgc(rating) {
		let ratingBgc = '';
		if (rating < 6) {
			ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%';
		} else if (rating > 6 && rating <= 8) {
			ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%';
		} else if (rating > 8 && rating <= 9) {
			ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
		} else if (rating > 9) {
			ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%';
		}
		return ratingBgc;
	}
	render();
	initActions();
}
