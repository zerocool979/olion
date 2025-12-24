const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const voteRoutes = require('./routes/voteRoutes');
const reportRoutes = require('./routes/reportRoutes');
const answerRoutes = require('./routes/answerRoutes');
const commentRoutes = require('./routes/commentRoutes');
const pakarRoutes = require('./routes/pakarRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reputationRoutes = require('./routes/reputationRoutes');
const adminAnswerRoutes = require('./routes/adminAnswerRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/pakar', pakarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reputation', reputationRoutes);

app.use('/api/admin/answers', adminAnswerRoutes);
app.use('/api/admin', require('./routes/adminUserRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

module.exports = app;
