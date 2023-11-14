/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    username: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    fullname: {
      type: 'text',
      notNull: true,
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
  pgm.dropTable('users');
};
