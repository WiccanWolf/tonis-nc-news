const endpointsJson = require('../endpoints.json');
const {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchComments,
  postNewComment,
  updateArticleVotes,
  removeCommentAtID,
  fetchUsers,
  fetchSpecificUser,
  updateCommentVotes,
  articleCreation,
  createArticle,
  fetchTopicsBySlug,
} = require('./app.models');

exports.healthCheck = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
exports.getArticleID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  const {
    sort_by = 'created_at',
    order = 'DESC',
    topic = 'coding',
  } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.createComment = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body;
  postNewComment(article_id, author, body)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};
exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentAtID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
exports.getSpecificUser = (req, res, next) => {
  const { username } = req.params;
  fetchSpecificUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
exports.updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(inc_votes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ comment: updatedComment });
    })
    .catch(next);
};
exports.createNewArticle = (req, res, next) => {
  const newArticle = req.body;
  createArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
exports.getSpecificTopic = (req, res, next) => {
  const { slug } = req.params;
  fetchTopicsBySlug(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
exports.userLogin = (req, res, next) => {};
