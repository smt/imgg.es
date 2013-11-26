var container = document.querySelector('ul'),
	packery;

packery = new Packery(container, {
    itemSelector: 'li',
    gutter: 10
});

imagesLoaded(container, function () {
    packery.layout();
});
