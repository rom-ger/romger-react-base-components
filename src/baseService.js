/*eslint no-magic-numbers: [2, { "ignore": [0, 10, 500, 5000, 3, 1] }]*/

import * as React from 'react';
import { toast } from 'react-toastify';
// import { sha256 } from './crypto';

class RomgerReactBaseService {
    static POST_METHOD = 'post';
    static GET_METHOD = 'get';
    static DEFAULT_ERROR_MESSAGE = {
        'Error: Request failed with status code 404': 'Ошибка! Страница не найдена',
        'Invalid resource owner credentials': 'Неверный логин или пароль',
        'Unauthorized': 'Вы не авторизованы'
    }
    static DEFAULT_TIMEOUT = 5000;
    static DEFAULT_TIMEOUT_UPDATE = 500;
    static timeoutCollections = {};
    static CURRENT_WIDTH = typeof document !== 'undefined' ? document.body.clientWidth : 0;

    static doPromise(promise, withoutToast = false) {
        return new Promise((resolve, reject) => {
            promise
                .then(res => {
                    if (!!res && res.data.error) {
                        RomgerReactBaseService.showToast(toast.error(res.data.error));
                        reject(res);
                        return;
                    }
                    if (!!res && res.data.message) {
                        RomgerReactBaseService.showToast(toast.success(res.data.message));
                    }
                    resolve(!!res ? res.data : null);
                })
                .catch(error => {
                    if (!withoutToast) {
                        RomgerReactBaseService.showToast(toast.error(RomgerReactBaseService.DEFAULT_ERROR_MESSAGE[error.toString()] ? RomgerReactBaseService.DEFAULT_ERROR_MESSAGE[error.toString()] : RomgerReactBaseService.parseErrorText(error.response)));
                    }
                    reject(error);
                });
        });
    }

    static parseErrorText(errorResponse = {}) {
        let error = null;
        if (!!errorResponse && errorResponse.data && (errorResponse.data.error || errorResponse.data.error_description)) {
            error = errorResponse.data.error_description || errorResponse.data.error;
        }
        else {
            error = !!errorResponse && errorResponse.data ? errorResponse.data.message ? errorResponse.data.message : errorResponse.data : 'Неизвестная ошибка';
        }
        return RomgerReactBaseService.DEFAULT_ERROR_MESSAGE[error] ? RomgerReactBaseService.DEFAULT_ERROR_MESSAGE[error] : error;
    }

    static showToast(toastId) {
        if (typeof window === 'undefined') {
            return;
        }
        window.setTimeout(() => toast.dismiss(toastId), RomgerReactBaseService.DEFAULT_TIMEOUT);
    }

    /**
     * Преобразовать параметры и заголовки для отправки на бэк
     * @param {*} method 
     * @param {*} params 
     * @param {*} config 
     */
    static parseParamsAndConfig(method = RomgerReactBaseService.GET_METHOD, params = {}, config = {}) {
        let _params = method === RomgerReactBaseService.GET_METHOD ? { params: params } : params;
        let _config = config;
        return {
            params: _params,
            config: _config
        };
    }

    /**
     * Форматирование чисел (1214234 превращаем в 1.214.234)
     * @param {*} sourceValue - исходное число
     * @param {*} length - для блоков для разделения
     * @param {*} separator - чем разделять блоки
     */
    static thousandSeparator(sourceValue, length = 3, separator = ' ') {
        let dex = 10;
        let fraction = (sourceValue + '').split('.')[1];
        let result = '';
        while (sourceValue >= Math.pow(dex, length)) {
            let part = RomgerReactBaseService._addZero(Math.floor(sourceValue % Math.pow(dex, length)), length);
            result = RomgerReactBaseService._addPartNumber(part, separator, result);
            sourceValue = Math.floor(sourceValue / Math.pow(dex, length));
        }
        result = RomgerReactBaseService._addPartNumber(sourceValue, separator, result);
        if (!!fraction) {
            result = `${result}.${fraction}`;
        }
        return result;
    }

    /**
     * Добавляем нужное количество нулей
     * @param {*} number 
     * @param {*} length 
     */
    static _addZero(number, length) {
        number = number + '';
        while (number.length < length) {
            number = `0${number}`;
        }
        return number;
    }

    /**
     * Добавляем очередную часть к числу
     * @param {*} number 
     * @param {*} separator 
     * @param {*} result 
     */
    static _addPartNumber(number, separator, result) {
        if (!result) {
            return `${number}`;
        }
        return `${number}${separator}${result}`;
    }

    /**
     * Колбэк на клик по документу, чтобы что-нибудь сделать, если кликнули за пределы элемента
     * @param evt 
     */
    static handlerOutsideClick(node, callbackOutside, removeHandler = false) {
        if (typeof document === 'undefined') {
            return;
        }
        document.addEventListener('click', (evt) => {
            let targetElement = evt.target;
            do {
                if (targetElement === node || !targetElement) {
                    return;
                }
                targetElement = targetElement.parentNode;
            } while (targetElement);
            callbackOutside();
        }, {
            once: !!removeHandler
        });
    }

    /**
     * Перейти в стэйт с помощью mobx
     * @param {String} stateName
     */
    static goToState(globalStore, stateName, params = null, url = null) {
        if (!globalStore) {
            return;
        }
        return globalStore.goToState(stateName, params, url);
    }

    /**
     * Промиз со спинером
     * @param {*} promise
     */
    static promiseWithLoading(globalStore, promise, loadingText = null, shadowBackground = false) {
        if (!globalStore) {
            return;
        }
        globalStore.startLoading(loadingText, shadowBackground);
        return new Promise((resolve, reject) => {
            promise
                .then(res => {
                    globalStore.stopLoading();
                    return resolve(res);
                })
                .catch(error => {
                    globalStore.stopLoading();
                    return reject(error);
                });
        });
    }

    /**
     * Разрешение экрана меньше либо равно принимаемому значению, в качестве аргумента, в пикселях
     */
    static currentWidth(resolution) {
        let currentWidth = document.body.clientWidth;

        if (!currentWidth) {
            return false;
        }

        return currentWidth <= resolution;
    }

    /**
     * Вызвать колбэк с таймаутом
     */
    static callCallbackWithTimeout = (field, callback, timeout = RomgerReactBaseService.DEFAULT_TIMEOUT_UPDATE) => {
            RomgerReactBaseService.timeoutCollections[field] = (new Date().getTime() * 10) / 10;
            return RomgerReactBaseService.clearTimeoutPause(field, callback, timeout);
    }

    /**
     * Выполнить колбэк с таймаутом
     * @param {*} field
     * @param {*} callback
     * @param {*} timeout
     */
    static clearTimeoutPause(field, callback, timeout) {
        if (typeof window === 'undefined') {
            return;
        }
        window.setTimeout(() => {
            if (RomgerReactBaseService.timeoutCollections[field] + timeout <= (new Date().getTime() * 10) / 10) {
                return callback();
            }
        }, timeout);
    }

    static useCallWithTimeout(field, entity, callback) {
        React.useEffect(
            () => RomgerReactBaseService.callCallbackWithTimeout(field, callback),
            [entity],
        );
    }

    static usePrevious(value) {
        const ref = React.useRef();
        React.useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    // static crypto = {
    //     sha256: sha256
    // };
}

export default RomgerReactBaseService;