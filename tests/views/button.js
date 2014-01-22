/* global describe, expect, it */

(function(ub) {

    'use strict';

    describe('Views.Button', function() {

        it('should extend ub.ComplexView', function() {
            var btn = new ub.Views.Button();

            expect(btn instanceof ub.ComplexView).to.equal(true);
        });

        it('should have configurable text', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn1'
                },
                text: 'Button Text 1'
            });

            ub.View.renderView(btn, '#test-container');

            setTimeout(function() {
                expect($('#test-container button').html()).to.equal('Button Text 1');
                btn.removeView();
                done();
            }, 100);
        });

        it('should have an output click and should be clickable', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn2'
                },
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            var clicks = 0;
            btn.outputs.click.subscribe(new ub.Observer(function(val) {
                console.log('clicked');
                clicks += 1;
                if (val === 2) {
                    expect(clicks).to.equal(2);
                    done();
                }
            }));

            var clickTrigger = new ub.Observable(function(obs) {
                this.write = function(val) {
                    obs.onNext(val);
                };
            });
            clickTrigger.subscribe(btn.inputs.click);

            clickTrigger.write(1);
            clickTrigger.write(2);
        });

        it('should have an configuration, disabled, to create a button in disabled state', function() {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn3',
                    disabled: true
                },
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            setTimeout(function() {
                expect(!!$('#test-container button').attr('disabled')).to.equal(true);
                btn.removeView();
            }, 500);
        });

        it('should have disabled input, to enable/disable the button', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn4'
                },
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            var disableTrigger = new ub.Observable(function(obs) {
                this.write = function(val) {
                    obs.onNext(val);
                };
            });
            disableTrigger.subscribe(btn.inputs.disabled);

            disableTrigger.write(true);

            setTimeout(function() {
                expect(!!$('#test-container button').attr('disabled')).to.equal(true);
                btn.removeView();
                done();
            }, 100);
        });

        it('should not write to click output, when it is disabled', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn5'
                },
                disabled: true,
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            var clickTrigger = new ub.Observable(function(obs) {
                this.write = function(val) {
                    obs.onNext(val);
                };
            });
            clickTrigger.subscribe(btn.inputs.click);

            var clickCounter = 0;
            btn.outputs.click.subscribe(new ub.Observer(function(val) {
                clickCounter += 1;
            }));

            clickTrigger.write(1);
            clickTrigger.write(2);

            setTimeout(function() {
                expect(clickCounter).to.equal(0);
                done();
            }, 500);
        });

        it('should have text input, to update the text', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn6'
                },
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            var textTrigger = new ub.Observable(function(obs) {
                this.write = function(val) {
                    obs.onNext(val);
                };
            });
            textTrigger.subscribe(btn.inputs.text);

            textTrigger.write('New Button Text');

            setTimeout(function() {
                expect($('#test-container button').html()).to.equal('New Button Text');
                btn.removeView();
                done();
            }, 500);
        });

        it('should work when embedded inside another view', function(done) {
            var TestView = ub.Utils.createView({
                picture: function() {
                    return {
                        name: ub.Views.Button,
                        props: {
                            id: 'btnEmbed'
                        },
                        text: 'Embedded Button'
                    };
                }
            });

            ub.View.renderView(new TestView(), '#test-container');

            setTimeout(function() {
                expect($('#test-container button').html()).to.equal('Embedded Button');
                done();
            }, 500);
        });
    });

}(window.uibase));