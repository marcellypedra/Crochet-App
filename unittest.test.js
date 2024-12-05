const request = require('supertest');
const express = require('express');
const app = require('server'); 
const mysql = require('mysql2/promise');

jest.mock('mysql2/promise', () => ({
    createPool: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue({
            execute: jest.fn(),
        }),
    }),
}));

const mockExecute = jest.fn();
mysql.createPool().promise.mockReturnValue({
    execute: mockExecute,
});

describe('CRUD Operations', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/projects', () => {
        it('should fetch ongoing and closed projects', async () => {
            const ongoingProjects = [
                { id: 1, name: 'Ongoing Project', materials: '[\"Cotton Yarn - Bright Yellow\", \"Silk Yarn - Emerald Green\"]', image: null },
            ];
            const closedProjects = [
                { id: 2, name: 'Closed Project', materials: '[\"Cotton Yarn - Bright Yellow\"]', image: null },
            ];

            mockExecute.mockResolvedValueOnce([ongoingProjects])
                       .mockResolvedValueOnce([closedProjects]);

            const response = await request(app).get('/api/projects');
            
            expect(response.status).toBe(200);
            expect(response.body.ongoingProjects).toEqual([
                { id: 1, name: 'Ongoing Project', materials: ["Bamboo Yarn"], image: null },
            ]);
            expect(response.body.closedProjects).toEqual([
                { id: 2, name: 'Closed Project', materials: ["Silk Yarn"], image: null },
            ]);
        });

        it('should return a 500 status on database error', async () => {
            mockExecute.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app).get('/api/projects');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal Server Error');
        });
    });

    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            mockExecute.mockResolvedValueOnce([{ insertId: 123 }]);

            const response = await request(app)
                .post('/api/projects')
                .send({
                    name: 'Unit Test',
                    description: 'Unit Test',
                    url: 'http://unittest.com',
                    project_type: 'ongoing',
                    materials: ['[\"Cotton Yarn - Bright Yellow\", \"Silk Yarn - Emerald Green\"]'],
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'Project created successfully',
                projectId: 123,
            });
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/projects')
                .send({ name: '' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing required fields: name or project_type');
        });
    });

    describe('PATCH /api/projects/:id', () => {
        it('should update a project', async () => {
            mockExecute.mockResolvedValueOnce([[{ id: 1 }]]);
            mockExecute.mockResolvedValueOnce();

            const response = await request(app)
                .patch('/api/projects/1')
                .send({
                    name: 'Updated Unit Test Project',
                    description: 'Updated Unit Test description',
                    materials: ['[\"Cotton Yarn - Bright Yellow\"]'],
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project updated');
        });

        it('should return 404 if project does not exist', async () => {
            mockExecute.mockResolvedValueOnce([[]]);

            const response = await request(app).patch('/api/projects/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Project not found');
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project', async () => {
            mockExecute.mockResolvedValueOnce();

            const response = await request(app).delete('/api/projects/1');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Project deleted');
        });
    });

    describe('POST /api/register', () => {
        it('should register a new user', async () => {
            mockExecute.mockResolvedValueOnce([{ insertId: 123 }]);

            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'testeruser',
                    email: 'testeruser@gmail.com',
                    password: 'password@322',
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'User registered successfully',
                userId: 123,
            });
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({ username: '', email: '', password: '' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing required fields: username, email, or password');
        });
    });

    describe('POST /api/login', () => {
        it('should log in a user successfully', async () => {
            const hashedPassword = '$2a$10$abcdefg'; 
            mockExecute.mockResolvedValueOnce([
                [{ id: 1, username: 'testeruser', email: 'testeruser@gmail.com', password: hashedPassword }],
            ]);

            const bcrypt = require('bcryptjs');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'testeruser@gmail.com',
                    password: 'password@322',
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.user).toEqual({
                user_id: 1,
                username: 'testeruser',
                email: 'testeruser@gmail.com',
            });
        });

        it('should return 401 for invalid credentials', async () => {
            mockExecute.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password@321',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });
    });

    describe('PATCH /api/reset-password', () => {
        it('should reset the password successfully', async () => {
            mockExecute.mockResolvedValueOnce([
                [{ email: 'testeruser@gmail.com' }],
            ]);
            mockExecute.mockResolvedValueOnce();

            const response = await request(app)
                .patch('/api/reset-password')
                .send({
                    email: 'testeruser@gmail.com',
                    password: 'password@123',
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password updated successfully.');
        });

        it('should return 404 if the user is not found', async () => {
            mockExecute.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .patch('/api/reset-password')
                .send({
                    email: 'nonexistent@gmail.com',
                    password: 'password@123',
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found.');
        });
    });
});
