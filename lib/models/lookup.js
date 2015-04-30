// Copyright 2014, Renasar Technologies Inc.
/* jshint node: true */

'use strict';

var di = require('di');

module.exports = LookupModelFactory;

di.annotate(LookupModelFactory, new di.Provide('Models.Lookup'));
di.annotate(LookupModelFactory, new di.Inject(
        'Model',
        'Assert',
        'Errors'
    )
);

function LookupModelFactory (Model, assert, Errors) {
    return Model.extend({
        connection: 'mongo',
        identity: 'lookups',
        attributes: {
            node: {
                model: 'nodes'
            },
            ipAddress: {
                type: 'string',
                unique: true,
                regex: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
            },
            macAddress: {
                type: 'string',
                unique: true,
                required: true,
                regex: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
            }
        },
        findByTerm: function (term) {
            return this.find({
                or: [
                    { node: term },
                    { macAddress: term },
                    { ipAddress: term }
                ]
            });
        },
        findOneByTerm: function (term) {
            return this.findByTerm(term).then(function (records) {
                if (records && records.length > 0) {
                    return records[0];
                } else {
                    throw new Errors.NotFoundError('Lookup Record Not Found (findOneByTerm)');
                }
            });
        },
        upsertNodeToMacAddress: function (node, macAddress) {
            assert.string(node, 'node');
            assert.string(macAddress, 'macAddress');

            var self = this;

            return this.findOne({ macAddress: macAddress }).then(function (record) {
                if (record) {
                    return self.update({ id: record.id }, { node: node }).then(function (records) {
                        return records[0];
                    });
                } else {
                    return self.create({ node: node, macAddress: macAddress });
                }
            });
        }
    });
}
