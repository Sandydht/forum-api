/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    content: {
      type: 'text',
      notNull: true,
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
      type: 'text',
      notNull: true,
      default: new Date().toISOString(),
    },
    updated_at: {
      type: 'text',
      notNull: true,
      default: new Date().toISOString(),
    },
    deleted_at: {
      type: 'text',
      notNull: false,
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_replies');
};
