var resourceModel = require('./../lib/resourceModel');

var list = exports.list = function list(options, callback, errorHandler) {
    resourceModel.list(options).then(callback, errorHandler);
};

var DEFAULT_PAGE = 1;
var DEFAULT_SIZE = 20;
var MAX_SIZE = 50;

var Paginator = function Paginator(page, size, total) {
    this.page = parseInt(page, 10);
    this.size = parseInt(size, 10);
    this.total = parseInt(total, 10);

    return {
        current: this.page,
        next: this.getNext(),
        prev: this.getPrev(),
        total: this.getTotal()
    };
}
Paginator.prototype.getNext = function getNext() {
    return (this.page < this.total) ? this.page + 1 : null;
};
Paginator.prototype.getPrev = function getPrev() {
    return (this.page > 1) ? this.page - 1 : null;
};
Paginator.prototype.getTotal = function getTotal() {
    return Math.ceil(this.total / this.size);
};

/*
 * GET home page.
 */

exports.index = function(req, res){
    var page = req.params.page || DEFAULT_PAGE;
    var size = (req.params.size && req.params.size <= MAX_SIZE) ? req.params.size : DEFAULT_SIZE;
    list(page, size, function (results, total) {
        paginator = 
        res.render('index', {
            title: 'imgg.es',
            results: results,
            page: new Paginator(page, size, total)
        });
    }, function (error) {
        if (error) {
            console.log(error);
        }
    });
};
