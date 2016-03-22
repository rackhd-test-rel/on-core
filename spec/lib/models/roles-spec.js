// Copyright 2016, EMC, Inc.


'use strict';

var base = require('./base-spec');
var  sandbox = sinon.sandbox.create();

describe('Models.Roles', function () {
    helper.before(function (context) {
        context.MessengerServices = function() {
            this.start= sandbox.stub().resolves();
            this.stop = sandbox.stub().resolves();
            this.publish = sandbox.stub().resolves();
        };
        return [
            helper.di.simpleWrapper(context.MessengerServices, 'Messenger')
        ];
    });

    base.before(function (context) {
        context.model = helper.injector.get('Services.Waterline').roles;
        context.attributes = context.model._attributes;
    });

    helper.after();

    describe('Base', function () {
        base.examples();
    });

    describe('Attributes', function () {
        describe('role', function () {
            before(function () {
                this.subject = this.attributes.role;
            });

            it('should be a string', function () {
                expect(this.subject.type).to.equal('string');
            });

            it('should be required', function () {
                expect(this.subject.required).to.equal(true);
            });
        });

        describe('privileges', function () {
            before(function () {
                this.subject = this.attributes.privileges;
            });

            it('should be a string', function () {
                expect(this.subject.type).to.equal('array');
            });
        });
    });
});