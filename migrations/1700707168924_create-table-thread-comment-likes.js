/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    comment_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'thread_comments',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
