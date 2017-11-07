'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = [];

    function addEvent(...params) {
        let [event, context, handler, times, frequency] = params;
        times = times > 0 ? times : Infinity;
        frequency = frequency > 0 ? frequency : 1;
        events.push({
            event,
            context,
            handler,
            currentTimes: 0,
            times,
            frequency
        });
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            addEvent(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            events = events.filter((currentEvent) => {
                return currentEvent.context !== context ||
                    currentEvent.event !== event &&
                        !currentEvent.event.startsWith('.');
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            event.split('.')
                .reduce((nameEvents, currentEvent) => {
                    let newEvent = nameEvents.length === 0 ? currentEvent
                        : [nameEvents.slice(-1), currentEvent].join('.');
                    nameEvents.push(newEvent);

                    return nameEvents;
                }, [])
                .reverse()
                .forEach((nameEvent) => {
                    events.forEach((eventData) => {
                        if (eventData.event === nameEvent) {
                            if (eventData.times > eventData.currentTimes &&
                                    eventData.currentTimes++ % eventData.frequency === 0) {
                                eventData.handler.call(eventData.context);
                            }
                        }
                    });
                });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            addEvent(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            addEvent(event, context, handler, null, frequency);

            return this;
        }
    };
}
