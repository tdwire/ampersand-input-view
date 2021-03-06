var test = require('tape');
var InputView = require('../ampersand-input-view');
if (!Function.prototype.bind) Function.prototype.bind = require('function-bind');

function isHidden(el) {
    return el.style.display === 'none';
}

function hasClass(el, klass) {
    return el.classList.contains(klass);
}

test('basic initialization', function (t) {
    var input = new InputView({ name: 'title' });
    input.render();
    t.equal(input.el.tagName, 'LABEL');
    t.equal(input.el.querySelectorAll('input').length, 1);
    t.equal(input.el.querySelector('input').getAttribute('name'), 'title');
    t.end();
});

test('initialize with value', function (t) {
    var input = new InputView({
        name: 'title',
        value: 'Once upon a time'
    });

    input.render();

    t.equal(input.el.querySelector('input').value, 'Once upon a time');
    t.end();
});

test('value must be entered if required', function (t) {
    var input = new InputView({
        name: 'title',
        required: true,
        tests: [
            function (val) {
                if (val.length < 5) return "Must be 5+ characters.";
            }
        ]
    });
    input.render();

    var inputElement = input.el.querySelector('input');
    var messageContainer = input.el.querySelector('[data-hook=message-container]');

    //"Trigger chnage events"
    //TODO: this should be real dom events
    inputElement.value = "O";
    input.handleInputChanged();
    input.handleBlur();

    t.notOk(input.valid, 'Input should be invalid');
    t.notOk(isHidden(messageContainer), 'Message should be visible');
    t.ok(hasClass(inputElement, 'input-invalid'), 'Has invalid class');
    t.notOk(hasClass(inputElement, 'input-valid'), 'Has valid class');

    //"Trigger change events again"
    inputElement.value = "Once upon a time!";
    input.handleInputChanged();
    input.handleBlur();

    t.ok(input.valid, 'Input should be valid');
    t.ok(isHidden(messageContainer), 'Message should not be visible');
    t.notOk(hasClass(inputElement, 'input-invalid'), 'Does not have invalid class');
    t.ok(hasClass(inputElement, 'input-valid'), 'Has valid class');

    t.end();
});
