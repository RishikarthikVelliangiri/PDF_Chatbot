import express from 'express';
import cors from 'cors';
import session from 'express-session';

import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// (Optional) if you wanted session storage:
app.use(session({
  secret: 'replace-with-a-secure-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Mount routes
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
