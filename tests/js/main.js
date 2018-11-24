const server = require('../../index');
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);

describe('Checking get requests on the platform', () => {
  describe('/GET /', () => {
      it('Should redirect to \'http://www.fumorrow.com/\'', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.redirects.should.include('http://www.fumorrow.com/')
              done();
            });
      });
  });
});