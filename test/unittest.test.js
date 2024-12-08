const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const server = require('../server'); 
const { promisePool } = require('../db');


chai.use(chaiHttp);
const expect = chai.expect;


describe('API Endpoints Unit Tests', () => {
    let dbStub;

    beforeEach(() => {
        dbStub = sinon.stub(promisePool, 'execute');
    });

    afterEach(() => {
        dbStub.restore(); 
    });

 

    //TEST PROJECT ENDPOINTS    
   
    describe('Projects Endpoints', () => {

        //test GET fecthing projects
        it('GET /api/ projects should fetch ongoing and closed projects', async () => {
            dbStub
            .onFirstCall()
            .resolves([[{ id: 1, name: 'Ongoing Project', project_type: 'ongoing' }]]);
        dbStub
            .onSecondCall()
            .resolves([[{ id: 2, name: 'Closed Project', project_type: 'closed' }]]);

        const res = await chai.request(server).get('/api/projects');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('ongoingProjects').that.is.an('array');
        expect(res.body).to.have.property('closedProjects').that.is.an('array');
    });

        // Test POST create a new Project
        it('POST /api/projects should create a new project', async () => {

            const UnitTestProject = {
                name: 'Unit Test Project',
                description: 'This is a unit test project',
                url: 'http://unittest.com',
                project_type: 'ongoing',
                materials: ['Bamboo yarn', 'Silk yarn'],
              };

              dbStub.resolves([{ insertId: 123 }]);

              const res = await chai.request(server).post('/api/projects').send(UnitTestProject);
  
              expect(res).to.have.status(201);
              expect(res.body).to.have.property('projectId').that.equals(123);
          });

        //Test PATCH to update a project without image
        it('PATCH /api/projects/:id should update a project without image', async () => {

            const UpdtUnitTestProject = {
                name: 'Unit Test Project',
                description: 'This is a update unit test project',
                url: 'http://updtunittest.com',
                project_type: 'ongoing',
                materials: ['Bamboo yarn', 'Silk yarn'],
              };

              
            dbStub.onFirstCall().resolves([[{ id: 1, project_type: 'ongoing' }]]);
            dbStub.onSecondCall().resolves();

            const res = await chai.request(server).patch('/api/projects/1').send(UpdtUnitTestProject);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').that.equals('Project updated');
        });

        //Test PATCH to update a project with image

        it('PATCH /api/projects/:id - should update a project with an image', async () => {
            dbStub.onFirstCall().resolves([[{ id: 1, project_type: 'ongoing' }]]);
            dbStub.onSecondCall().resolves();

            const res = await chai
                .request(server)
                .patch('/api/projects/1')
                .attach('image', Buffer.from('dummy_image'), 'test.jpg')
                .field('name', 'Unit Test Project')
                .field('description', 'This is a update unit test project')
                .field('url', 'http://updtunittest.com')
                .field('materials', JSON.stringify(['Bamboo yarn', 'Silk yarn']));

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').that.equals('Project updated');
        });


        //Test PATCH to mark a project as closed

        it('PATCH /api/projects/:id/close - should mark project as closed', async () => {
            dbStub.resolves();

            const res = await chai.request(server).patch('/api/projects/1/close');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Project marked as closed');
        });


        // Test DELETE a project
        it('DELETE /api/projects/:id - should delete a project', async () => {
            dbStub.resolves();

            const res = await chai.request(server).delete('/api/projects/1');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Project deleted');
        });
    });


    // TEST USER ENDPOINTS
    
    describe('User Endpoints', () => {

        //Test User registration 
        it('POST /api/register should register a new user', async () => {

            const hashedPassword = await bcrypt.hash(newUser.password, 10); 

            const newUser = {
                username: 'Unittestuser',
                email: 'unittest@user.com',
                password: hashedPassword
            };

            dbStub.resolves([{ insertId: 1 }]);

            const res = await chai.request(server).post('/api/register').send(newUser);

            expect(executeStub.calledWith(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                ['Unittestuser', 'unittest@user.com', sinon.match.string]  
              )).to.be.true;

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').that.equals('User registered successfully');
            sinon.assert.calledWith(dbStub, sinon.match.string, [
                newUser.username,
                newUser.email,
                hashedPassword

            ]);

        });

        //Test user login
        it('POST /api/login - should login user with valid credentials', async () => {
            const user = {
                email: 'unittest@user.com',
                password: 'password123'
            };

            const hashedPassword = await bcrypt.hash(user.password, 10);

            dbStub.resolves([[{ id: 1, username: 'Unittestuser', email: user.email, password: hashedPassword }]]);

            const res = await chai.request(server).post('/api/login').send(user);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').that.equals('Login successful');
        });
        
        it('POST /api/register should fail with invalid credentials', async () => {
            const user = {
                email: 'wrong@user.com',
                password: 'wrongpassword'
            };

            dbStub.resolves([[]]); // Simulate no matching user in the database

            const res = await chai.request(server).post('/api/login').send(user);

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message').that.equals('Invalid email or password');
        });

    //Test Reset Password endpoint
        it('PATCH /api/reset-password - should reset user password', async () => {
            const resetPWD = {
                email: 'unittest@user.com',
                password: 'password123'
            };

            dbStub.onFirstCall().resolves([[{ id: 1, username: 'Unittestuser', email: resetPWD.email }]]);
            dbStub.onSecondCall().resolves();

            const res = await chai.request(server).patch('/api/reset-password').send(resetPWD);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').that.equals('Password updated successfully.');
        });
    
        it('PATCH /api/reset-password - should fail for non-existing user', async () => {
            const resetPWD = {
                email: 'wrong@user.com',
                password: 'wrongpassword'
            };

            dbStub.onFirstCall().resolves([[]]); // Simulate no user found

            const res = await chai.request(server).patch('/api/reset-password').send(resetPWD);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('User not found.');
        });
    });
});   

