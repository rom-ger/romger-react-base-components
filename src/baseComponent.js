/*eslint no-useless-escape: "error"*/

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import * as queryString from 'query-string';
import { confirmAlert } from 'react-confirm-alert';
import { forOwn, get, set } from 'lodash';

class RomgerReactBaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.emailReg = /^[-._a-zA-Z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/;
        this.stringReg = /^[-а-яА-ЯёЁa-zA-Z]+$/;
        this.phoneMask = '+7(111)111-11-11';
        this.VALID_ADD = 'Valid';
        this.dex = 10;
        this.DEFAULT_TIMEOUT_UPDATE = 500;
        this.timeoutCollections = {};
        this.loading = false;
        this.PAGE_SIZE_FOR_SEARCH = 10;
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.MAX_WIDTH_FOR_XS = 767;
        this.MAX_WIDTH_FOR_SM = 991;
        this.scrollWrapNode = null; //элемент, который мы хотим скролить
    }

    /**
     * Создаём функцию, которая либо отдаёт либо изменяет поле из стейта
     * @param {string} field - наименование поля
     * @param {*} callback - колбэк на изменение поля, поле будет меняться, если callback не передали или если он вернул true
     */
    getSetStateField = (path, validCallback, changeCallback) => {
        let context = this;
        return function (value) {
            if (!arguments.length || (!!validCallback && !validCallback(value))) {
                return get(context.state, path);
            }
            let array = path.split(/[\[\]\.]/).filter(el => el !== '');
            let main = context.state[array[0]];
            let mainPath = array[0];
            if (array.length > 1) {
                array.splice(0,1);
                set(main, array, value);
            }
            else {
                main = value;
            }
            context.setState({
                [mainPath]: main,
            }, () => changeCallback ? changeCallback() : null);
            return value;
        };
    }

    /**
     * Получить объект момента
     * @param {*} date
     */
    moment(date = new Date()) {
        return moment(date).locale('ru');
    }

    /**
     * Получить дату на начало периода
     * @param {*} date
     * @param {*} of
     */
    startOf(date, ofString = 'day') {
        if (!date) {
            return null;
        }
        let momentDate = this.moment(date);
        if (!momentDate) {
            return null;
        }
        momentDate = momentDate.startOf(ofString);
        if (!momentDate) {
            return null;
        }
        return momentDate._d;
    }

    /**
     * Получить дату на конец периода
     * @param {*} date
     * @param {*} of
     */
    endOf(date, ofString = 'day') {
        if (!date) {
            return null;
        }
        let momentDate = this.moment(date);
        if (!momentDate) {
            return null;
        }
        momentDate = momentDate.endOf(ofString);
        if (!momentDate) {
            return null;
        }
        return momentDate._d;
    }

    /**
     * Перейти в стэйт с помощью mobx
     * @param {String} stateName
     */
    goToState(stateName, params = null, url = null) {
        return this.props.globalStore.goToState(stateName, params, url);
    }

    /**
     * Открыть запрашиваемый стейт в новой вкладке
     * @param {*} stateName
     */
    goToBlankState(stateName) {
        if (typeof document === 'undefined' || typeof window === 'undefined') {
            return;
        }
        let oldHref = document.location.href;
        let index = oldHref.indexOf('#');
        let parent = oldHref.substr(0, index - 1);
        let newHref = parent + '/#/' + stateName;
        window.open(newHref, '_blank');
    }

    /**
     * Мы на самом маленьком экране
     */
    widthXS() {
        if (typeof document === 'undefined') {
            return;
        }
        return parseInt(document.body.clientWidth, this.dex) <= this.MAX_WIDTH_FOR_XS;
    }

    /**
     * Мы на среднем или маленьком экране
     */
    widthXSSM() {
        if (typeof document === 'undefined') {
            return;
        }
        return parseInt(document.body.clientWidth, this.dex) <= this.MAX_WIDTH_FOR_SM;
    }

    /**
     * Мы на среднем экране
     */
    widthSM() {
        if (typeof document === 'undefined' || typeof window === 'undefined') {
            return;
        }
        return parseInt(document.body.clientWidth, this.dex) > this.MAX_WIDTH_FOR_XS && parseInt(window.localStorage.getItem('WS_REACT_CURRENT_WIDTH'), this.dex) <= this.MAX_WIDTH_FOR_SM;
    }

    /**
     * Мы на нормальном экране
     */
    widthMD() {
        if (typeof document === 'undefined') {
            return;
        }
        return parseInt(document.body.clientWidth, this.dex) > this.MAX_WIDTH_FOR_SM;
    }

    /**
     * Разрешение экрана меньше либо равно принимаемому значению, в качестве аргумента, в пикселях
     */
    currentWidth(resolution) {
        let currentWidth = document.body.clientWidth;

        if (!currentWidth) {
            return false;
        }

        return currentWidth <= resolution;
    };

    /**
     * Принудительный рендеринг
     */
    forceUpdateHandler() {
        this.forceUpdate();
    }

    /**
     * Обновляем поля в стэйте
     */
    updateStateArray = (array, callback = null, timeout = this.DEFAULT_TIMEOUT_UPDATE) => {
        let updateObj = {};
        array.forEach(item => {
            updateObj[item.field] = item.value;
        });
        this.setState(updateObj, () => {
            if (!callback) {
                return;
            }
            this.timeoutCollections[array.map(item => item.field).join(',')] = new Date().getTime();
            return this.clearTimeoutPause(array.map(item => item.field).join(','), callback, timeout);
        });
    }

    /**
     * Обновляем поле в стэйте
     */
    updateState = (value, field, callback = null, timeout = this.DEFAULT_TIMEOUT_UPDATE) => {
        let updateObj = {};
        updateObj[field] = value;
        this.setState(updateObj, () => {
            if (!callback) {
                return;
            }
            this.timeoutCollections[field] = (new Date().getTime() * 10) / 10;
            return this.clearTimeoutPause(field, callback, timeout);
        });
    }

    /**
     * Выполнить колбэк с таймаутом
     * @param {*} field
     * @param {*} callback
     * @param {*} timeout
     */
    clearTimeoutPause(field, callback, timeout) {
        if (typeof window === 'undefined') {
            return;
        }
        window.setTimeout(() => {
            if (this.timeoutCollections[field] + timeout <= (new Date().getTime() * 10) / 10) {
                return callback();
            }
        }, timeout);
    }

    /**
     * Колбэк по валидации поля
     */
    validateForm(field, isError) {
        let obj = {};
        obj[field] = isError;
        this.setState(obj);
        this.forceUpdateHandler();
    }

    /**
     * Проверить на валидность все поля из массива
     * @param {*} arrayField
     */
    allFieldValid(arrayField) {
        let valid = true;
        arrayField.forEach(item => valid = valid && (this.state[item + this.VALID_ADD] === undefined || this.state[item + this.VALID_ADD]));
        return valid;
    }

    /**
     * Промиз со спинером
     * @param {*} promise
     */
    promiseWithLoading(promise, loadingText = null, shadowBackground = false) {
        this.props.globalStore.startLoading(loadingText, shadowBackground);
        return new Promise((resolve, reject) => {
            promise
                .then(res => {
                    this.props.globalStore.stopLoading();
                    return resolve(res);
                })
                .catch(error => {
                    this.props.globalStore.stopLoading();
                    return reject(error);
                });
        });
    }

    /**
     * Промиз с локальным спинером
     * @param {*} promise
     */
    promiseWithLocalLoading(promise, loadingText = null, shadowBackground = false) {
        this.loading = true;
        this.forceUpdate();
        return new Promise((resolve, reject) => {
            promise
                .then(res => {
                    this.loading = false;
                    this.forceUpdate();
                    return resolve(res);
                })
                .catch(error => {
                    this.loading = false;
                    this.forceUpdate();
                    return reject(error);
                });
        });
    }

    /**
     * Получение объекта запроса
     */
    getUrlQueryObject() {
        return queryString.parse(this.props.location.search);
    }

    /**
     * Получение query параметра по имени
     * @param {*} name
     */
    getUrlQueryParam(name) {
        return this.getUrlQueryObject()[name];
    }

    /**
     * Установка query параметров
     * @param {Array<Object>} params
     */
    setUrlQueryParams(params = []) {
        let queryObj = this.getUrlQueryObject();
        params.map(item => item ? Object.assign(queryObj, item) : null);
        let newQueryString = queryString.stringify(queryObj);
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: newQueryString ? '?' + queryString.stringify(queryObj) : ''
        });
    }

    /**
     * Очистка query параметров
     */
    clearUrlQueryParams() {
        this.props.location.search = '';
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: ''
        });
    }

    /**
     * типа интерфейс
     */
    updateContent() { }

    /**
     * Добавить в текущий state поля для pagination
     */
    createPagination(pageSize) {
        this.state.pagination = {
            pageNo: 0,
            totalCount: 0,
            pageSize: pageSize
        };
    }

    /**
     * Для перехода по страницам
     */
    updatePagination = ({ pageNo, pageSize }, updateCallback = null) => {
        let pagination = this.state.pagination;
        pagination.pageNo = pageNo;
        pagination.pageSize = pageSize;
        this.setState({ pagination: pagination }, () => updateCallback ? updateCallback() : this.updateContent());
    }

    /**
     * Получить копию объекта
     * @param {*} object
     */
    copyObject(object) {
        let newObj = JSON.stringify(object);
        return JSON.parse(newObj);
    }

    /**
     * Открытие модального окна для подтверждения
     * @param {*} title
     * @param {*} message
     * @param {*} confirmLabel
     * @param {*} cancelLabel
     * @param {*} onConfirm
     * @param {*} onCancel
     */
    showConfirmModal(title, message, confirmLabel, cancelLabel, onConfirm, onCancel) {
        return confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: cancelLabel,
                    onClick: onCancel ? onCancel : null
                },
                {
                    label: confirmLabel,
                    onClick: onConfirm ? onConfirm : null
                }
            ]
        });
    }

    /**
     * Скопировать все поля из нового объекта в старый
     * @param {*} oldObject
     * @param {*} newObject
     */
    copyAllFields(oldObject, newObject) {
        forOwn(newObject, (value, field) => oldObject[field] = value);
        return oldObject;
    }

    /**
     * Обновить элемент, который мы хотим скролить
     */
    updateScrollWrapNode(node) {
        let element = ReactDOM.findDOMNode(node);
        if (!element || (!!this.scrollWrapNode && (this.scrollWrapNode.classList.value === element.classList.value))) {
            return;
        }
        this.scrollWrapNode = element;
        this.forceUpdate();
    }

    /**
     * Валиден ли email
     */
    isEmailValid(email) {
        let emailReg = new RegExp('^[-._a-zA-Z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$');
        return emailReg.test(email);
    }

    /**
     * Валидация пароля
     * @param {*} value
     */
    isPasswordValid(value) {
        const minLengthPassword = 8;
        let regExp = /([0-9]{1})([a-z]{1})([A-Z]{1})/;
        if (!value || (!regExp.test(value) && value.length < minLengthPassword)) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default RomgerReactBaseComponent;
