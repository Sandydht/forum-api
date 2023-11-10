/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
