/**
 * Sprint 1 Auth Integration Tests
 * Run: npm test
 *
 * Uses an in-memory MongoDB via mongodb-memory-server for zero external deps.
 * To install: npm install --save-dev mongodb-memory-server
 * Then update jest.config.js: globalSetup / globalTeardown (see README).
 *
 * For a quick smoke test without a real DB, mock mongoose at the top level.
 */

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clean users collection between tests
  await mongoose.connection.collection('users').deleteMany({});
});

// ─── Registration ─────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/register', () => {
  const validPayload = {
    name: 'Alice Drops',
    email: 'alice@equa.io',
    password: 'SecurePass1',
  };

  it('creates a new user and returns token pair', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(validPayload.email);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Must never be exposed
  });

  it('rejects duplicate email with 409', async () => {
    await request(app).post('/api/v1/auth/register').send(validPayload);
    const res = await request(app).post('/api/v1/auth/register').send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing name with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@equa.io', password: 'SecurePass1' });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects weak password with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test', email: 'test@equa.io', password: 'weak' });

    expect(res.status).toBe(422);
  });

  it('rejects invalid email format with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'SecurePass1' });

    expect(res.status).toBe(422);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/login', () => {
  const user = { name: 'Bob Flow', email: 'bob@equa.io', password: 'SecurePass1' };

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(user);
  });

  it('returns token pair for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(user.email);
  });

  it('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPass1' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@equa.io', password: user.password });

    expect(res.status).toBe(401);
  });

  it('rejects missing password with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email });

    expect(res.status).toBe(422);
  });
});

// ─── Protected Route ──────────────────────────────────────────────────────────

describe('GET /api/v1/auth/me', () => {
  let accessToken: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Carol Pipe', email: 'carol@equa.io', password: 'SecurePass1' });
    accessToken = res.body.data.tokens.accessToken;
  });

  it('returns user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('carol@equa.io');
  });

  it('rejects request with no token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer this.is.garbage');
    expect(res.status).toBe(401);
  });
});
