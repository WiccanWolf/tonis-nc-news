const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../express-app/app');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const { toBeSortedBy } = require('jest-sorted');

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('404 Route Handler', () => {
  const invalidEndpoints = [
    '/api/nonexistentendpoint',
    '/api/users/unknownUser',
    '/api/invalidRoute',
    '/random/invalid/endpoint',
  ];

  invalidEndpoints.forEach((endpoint) => {
    test(`404: responds with "Not Found" for ${endpoint}`, () => {
      return request(app)
        .get(endpoint)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  });
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
        expect(body.msg).toBe('Bad Request: Invalid Order Query');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: responds with an array of comments for the given article_id, sorted by most recent first', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });
        expect(new Date(comments[0].created_at).getTime()).toBeGreaterThan(
          new Date(comments[comments.length - 1].created_at).getTime()
        );
      });
  });

  test('200: responds with an empty array if the article exists but has no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });

  test('400: responds with "Bad Request" for an invalid article_id', () => {
    return request(app)
      .get('/api/articles/invalid/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: successfully adds a comment for an article and responds with the posted comment', () => {
    const newComment = {
      author: 'albertthelad',
      body: 'Great article! Needs more biscuits though...',
    };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            author: 'albertthelad',
            body: 'Great article! Needs more biscuits though...',
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test('400: responds with "Bad Request" if author is missing in request body', () => {
    const newComment = {
      body: 'Mmm delicious',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('400: responds with "Bad Request" if body is missing in the request body', () => {
    const newComment = {
      username: 'opaltheeeper123',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('400: responds with "Bad Request" if body is too short (less than 1 character)', () => {
    const newComment = {
      username: 'theWalkingDictionary',
      body: '',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: successfully updates the votes of an article and responds with the updated article', () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/1')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });

  test('200: successfully decrements the votes of an article', () => {
    const newVote = { inc_votes: -5 };
    return request(app)
      .patch('/api/articles/2')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-5);
      });
  });

  test('400: responds with "Bad Request" if inc_votes is not provided', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('400: responds with "Bad Request" if inc_votes is not a number', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'notANumber' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: successfully deletes a comment by comment_id and responds with no content', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });

  test('400: responds with "Bad Request" if comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/abc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('GET /api/users', () => {
  test('200: should return an array of user objects with username, name, and avatar_url', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('avatar_url');
        });
      });
  });
});
describe.only('GET /api/users/:username', () => {
  test('200: Responds with a user object containing username, avatar_url, and name', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'butter_bridge',
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });

  test('404: Responds with an error if username does not exist', () => {
    return request(app)
      .get('/api/users/nonexistent_user')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });

  test('400: Responds with an error if username is invalid', () => {
    return request(app)
      .get('/api/users/user name')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});
describe('PATCH /api/comments/:comment_id', () => {
  test('200: Updates the votes for the specified comment and responds with the updated comment', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            votes: expect.any(Number),
          })
        );
        expect(body.comment.votes).toBe(17);
      });
  });

  test('200: Decrements the votes for the specified comment and responds with the updated comment', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(13);
      });
  });

  test('400: Responds with an error if inc_votes is missing from request body', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: inc_votes is required');
      });
  });

  test('400: Responds with an error if inc_votes is not a number', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 'invalid' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: inc_votes must be a number');
      });
  });

  test('404: Responds with an error if comment_id does not exist', () => {
    return request(app)
      .patch('/api/comments/999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('400: Responds with an error if comment_id is invalid', () => {
    return request(app)
      .patch('/api/comments/not-a-number')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: Invalid comment_id');
      });
  });
});
