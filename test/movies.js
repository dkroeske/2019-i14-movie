var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

chai.should();

chai.use(chaiHttp);

describe('Movies', () => {

    it('Create new movie and post', function (done) {
        chai.request(server)
            .post('/apiv2/movies')
            .set('Content-Type', 'application/json')
            .send({
                "id": 2,
                "title": "Ben Hur",
                "year": 1961,
                "director": "William Wyler-II"               
            })
            .end(function(err, res, body) {
                res.should.have.status(200);
                done()
            })
    });

    it('Create new movie and post', function (done) {
        chai.request(server)
            .post('/apiv2/movies')
            .set('content-type', 'application/json')
            .send({
                "id": 4,
                "title": "Ben Hur",
                "year": 2010,
                "director": "Steve Shill"               
            })
            .end(function(err, res, body) {
                res.should.have.status(200);
                done()
            })
    });
  
    it('It should get movie with id=4', function (done) {
        chai.request(server)
            .get('/apiv2/movies?id=4')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });


    it('It should handle unknown endpoints (GET)', function (done) {
        chai.request(server)
            .get('/apiv2/lkjlkjfdsldkfjsl')
            .end(function (err, res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                done();
            })
    });
  
});