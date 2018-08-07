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
  return db.createTable('source_word', {
      source_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        length: 10
      },
      word_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        length: 10
      },
      frequency: {
        type: 'int',
        unsigned: true,
        notNull: true,
        defaultValue: 1
      },
    })
    .then(() => {
      return db.addIndex('source_word', 'source_id', ['source_id']);
    })
    .then(() => {
      return db.addIndex('source_word', 'word_id', ['word_id']);
    });
};

exports.down = function(db) {
  return db.dropTable('source_word');
};

exports._meta = {
  "version": 1
};
