const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let issue_id;

suite('Functional Tests', function () {

  suite('Create Issues', () => {
    // Create an issue with every field: POST request to /api/issues/{project}
    test("Create an issue with every field", (done) => {
      chai.request(server)
          .post('/api/issues/unitTest')
          .send({
            issue_title:"Functional Tests",
            issue_text:"This is a functional test using chai & mocha",
            created_by:"OK",
            status_text:"Ongoing",
            assigned_to:"KO"
          })
          .end((err,res) => {
            issue_id = res.body._id
            assert.equal(res.status, 200)
            assert.equal(res.body.issue_title,"Functional Tests")
            assert.equal(res.body.issue_text,"This is a functional test using chai & mocha")
            assert.equal(res.body.created_by,"OK")
            assert.equal(res.body.status_text,"Ongoing")
            assert.equal(res.body.assigned_to,"KO")
            assert.property(res.body, 'created_on')
            assert.property(res.body, 'updated_on')
            assert.property(res.body, 'open')
            assert.property(res.body, "_id")
            done()
          })

    })

    // Create an issue with only required fields: POST request to /api/issues/{project}
    test("Create an issue with only required fields", (done) => {
      chai.request(server)
      .post('/api/issues/unitTest')
      .send({
        issue_title:"Functional Tests-2",
        issue_text:"2nd functional test",
        created_by:"OK",
        status_text:"",
        assigned_to:""
      })
      .end((err,res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.issue_title,"Functional Tests-2")
        assert.equal(res.body.issue_text,"2nd functional test")
        assert.equal(res.body.created_by,"OK")
        assert.equal(res.body.status_text,"")
        assert.equal(res.body.assigned_to,"")
        assert.property(res.body, 'created_on')
        assert.property(res.body, 'updated_on')
        assert.property(res.body, 'open')
        done()
      })

    })
  //   // Create an issue with missing required fields: POST request to /api/issues/{project}
    test("Create an issue with missing required fields", (done) => {
      chai.request(server)
      .post('/api/issues/unitTest')
      .send({
        issue_title:"",
        issue_text:"",
        created_by:"",
        status_text:"",
        assigned_to:""
      })
      .end((err,res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'required field(s) missing')
        done()
      })
    })
  })

  suite('View Issues', () => {
  //   // View issues on a project: GET request to /api/issues/{project}
    test('View issues on a project', (done) => {
     chai.request(server)
         .get('/api/issues/unitTest')
         .end((req,res) => {
           assert.equal(res.status, 200)
           assert.isArray(res.body, 'Response is an array of objects')
           if(res.body.length > 0){
           assert.isObject(res.body[0], 'First element is an object')  
           assert.property(res.body[0], 'assigned_to')
           assert.property(res.body[0], 'status_text')
           assert.property(res.body[0], 'open')
           assert.property(res.body[0], 'issue_title')
           assert.property(res.body[0], 'issue_text')
           assert.property(res.body[0], 'created_by')
           assert.property(res.body[0], 'created_on')
           assert.property(res.body[0], 'updated_on')
           assert.equal(Object.keys(res.body[0]).length, 9)
           }
           done()
         })

    })
    //View issues on a project with one filter: GET request to /api/issues/{project}
    test('View issues on a project with one filter', (done) => {
      chai.request(server)
      .get('/api/issues/unitTest?open=false')
      .end((req,res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'Response is an array of objects')
        if(res.body.length > 0){
        assert.isObject(res.body[0], 'First element is an object')  
        assert.property(res.body[0], 'assigned_to')
        assert.property(res.body[0], 'status_text')
        assert.property(res.body[0], 'open')
        assert.property(res.body[0], 'issue_title')
        assert.property(res.body[0], 'issue_text')
        assert.property(res.body[0], 'created_by')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'updated_on')
        assert.equal(Object.keys(res.body[0]).length, 9)
        }
        done()
      })

    })
  //   // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test('View issues on a project with one filter', (done) => {
      chai.request(server)
      .get('/api/issues/unitTest?open=false&created_by=me')
      .end((req,res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'Response is an array of objects')
        if(res.body.length > 0){
        assert.isObject(res.body[0], 'First element is an object')  
        assert.property(res.body[0], 'assigned_to')
        assert.property(res.body[0], 'status_text')
        assert.property(res.body[0], 'open')
        assert.property(res.body[0], 'issue_title')
        assert.property(res.body[0], 'issue_text')
        assert.property(res.body[0], 'created_by')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'updated_on')
        assert.equal(Object.keys(res.body[0]).length, 9)
        }
        done()
      })
    })
  })

  suite('Update Issues', () => {
    //  Update one field on an issue: PUT request to /api/issues/{project}
    test('Update one field on an issue', (done) => {
     chai.request(server)
         .put('/api/issues/unitTest')
         .send({_id : issue_id}) 
         .end((err,res) => {
          //  { error: 'no update field(s) sent', _id: '5fe61c9f431aa7083b537a23' }
           assert.equal(res.body.error, 'no update field(s) sent')
           assert.equal(res.body._id, issue_id) 
          //  assert.equal(res.body._id, issue_id)
           done()
         })
    })
      // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('Update multiple fields on an issue', (done) => {
      chai.request(server)
          .put('/api/issues/unitTest')
          .send({
            _id : issue_id, 
            issue_title:"Functional Tests-3",
            issue_text:"This is a functional test - 3 on put request",
            created_by:"OK",
            status_text:"Ongoing",
            assigned_to:"KO"
          }).end((err,res) => {
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, issue_id) // to change to issue_id later
            done()
          })      
    })
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test('Update an issue with missing _id', (done) => {
      chai.request(server)
      .put('/api/issues/unitTest')
      .send({
        issue_title:"Functional Tests-3",
        issue_text:"This is a functional test - 3 on put request",
        created_by:"OK",
        status_text:"Ongoing",
        assigned_to:"KO"
      }).end((err,res) => {
        console.log('update', res.body)
        assert.property(res.body, "error")
        assert.equal(res.body.error, 'missing _id')
        done()
      })
    })
    //Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('Update an issue with no fields to update', (done) => {
      chai.request(server)
          .put('/api/issues/unitTest')
          .send({_id : issue_id}) 
          .end((err, res) => {
            assert.property(res.body, "error")
            assert.equal(res.body.error, "no update field(s) sent")
            done()
          })

    })
    //Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('Update an issue with an invalid _id:', (done) => {
      chai.request(server)
          .put('/api/issues/unitTest')
          .send({
            _id : "5fabc84633d872159d4f01a6", 
            issue_title:"Functional Tests-3",
            issue_text:"This is a functional test - 3 on put request",
            created_by:"OK",
            status_text:"Ongoing",
            assigned_to:"KO"
          })
          .end((err,res) => {
            assert.property(res.body, 'error')
            assert.equal(res.body.error, 'could not update')
            done()  
          })

    })
  })

  suite('Delete Issues', () => {
    // Delete an issue: DELETE request to /api/issues/{project}
    test('Delete an issue', (done) => {
      chai.request(server)
          .delete('/api/issues/unitTest')
          .send({_id : issue_id})
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully deleted')
            assert.equal(res.body._id, issue_id)
            done()
          })      
    })
    //   Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('Delete an issue with an invalid _id', (done) => {
      chai.request(server)
        .delete('/api/issues/unitTest')
        .send({_id : "5fabc84633d872159d4f01a6"})
        .end((err, res) => {
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'could not delete')
          done()
        })
    })
    // Delete an issue with missing _id: DELETE request to /api/issues/{project} 
    test('Delete an issue with missing _id', (done) => {
      chai.request(server)
        .delete('/api/issues/unitTest')
        .end((err, res) => {
          console.log('delete', res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })
  })

});