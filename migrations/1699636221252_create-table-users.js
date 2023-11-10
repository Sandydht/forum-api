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
  pgm.dropTable('users');
};
