/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    body: {
      type: 'text',
      notNull: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    created_at: { // epoch
      type: 'integer',
      notNull: true,
      default: Math.floor(new Date().getTime() / 1000.0),
    },
    updated_at: { // epoch
      type: 'integer',
      notNull: true,
      default: Math.floor(new Date().getTime() / 1000.0),
    },
    deleted_at: { // epoch
      type: 'integer',
      notNull: false,
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
