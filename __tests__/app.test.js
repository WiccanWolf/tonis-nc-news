const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../express-app/app');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const toBeSortedBy = require('jest-sorted');
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/topics', () => {
  test('200: Responds with an array of topics, each with a slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topic } }) => {
        expect(Array.isArray(topic)).toBe(true);
        expect(topic).toHaveLength(3);
        topic.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test('404: Responds with an error message when the endpoint does not exist', () => {
    return request(app)
      .get('/api/nonexistent-endpoint')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200: Responds with an article object with the correct properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test('400: Responds with an error message if article_id is not a valid number', () => {
    return request(app)
      .get('/api/articles/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('404: Responds with an error message if no article is found for a valid but non-existent ID', () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('GET /api/articles', () => {
  test('200: Responds with an array of article objects with the correct properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
          expect(article).not.toHaveProperty('body');
        });
      });
  });

  test('200: Articles are sorted by created_at in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });

  test('404: Responds with an error message when endpoint does not exist', () => {
    return request(app)
      .get('/api/nonexistent')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('400: Responds with an error message for invalid sort_by query', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_column')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: Invalid Sort Query');
      });
  });

  test('400: Responds with an error message for invalid order query', () => {
    return request(app)
      .get('/api/articles?order=INVALID')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request: Invalid Order Query');
      });
  });
});
