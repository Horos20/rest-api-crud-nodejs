const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Workers api', () => {
  let workerId;
  
  it('should get all workers', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should create a new worker', (done) => {
    const worker = { employee_name: "Annie", employee_salary: 45000, employee_age: 20, profile_image: "" };
    chai.request(server)
      .post('/')
      .send(worker)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body['data'][0].should.have.property('employee_name').eql(worker.employee_name);
        res.body['data'][0].should.have.property('employee_salary').eql(worker.employee_salary);
        res.body['data'][0].should.have.property('employee_age').eql(worker.employee_age);
        res.body['data'][0].should.have.property('profile_image').eql(worker.profile_image);
        
        workerId = res.body['data'][0].id;
        done();
      });
  });

  it('should update an existing worker', (done) => {
    const worker = { employee_name: "Annie", employee_salary: 50000, employee_age: 22, profile_image: "" };
    chai.request(server)
      .put('/' + workerId)
      .send(worker)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body['data'][0].should.have.property('employee_name').eql(worker.employee_name);
        res.body['data'][0].should.have.property('employee_salary').eql(worker.employee_salary);
        res.body['data'][0].should.have.property('employee_age').eql(worker.employee_age);
        res.body['data'][0].should.have.property('profile_image').eql(worker.profile_image);
        done();
      });
  });

  it('should delete an existing worker', (done) => {
    chai.request(server)
      .delete('/' + workerId)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});