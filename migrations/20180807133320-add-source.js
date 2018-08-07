'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('source', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      length: 10
    },
    parent: {
      type: 'int',
      unsigned: true,
      notNull: false,
      length: 10
    },
    name: {
      type: 'string',
      length: 30,
      notNull: true,
      unique: true
    },
    description: {
      type: 'text'
    }
  })
};

exports.down = function(db) {
  return db.dropTable('source');
};

exports._meta = {
  "version": 1
};
