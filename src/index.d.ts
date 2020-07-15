
import * as React from 'react';
import { Moment } from 'moment';
import { any } from 'prop-types';

interface ParseParamsAndConfig {
    params: object;
    config: object;
}

declare class GlobalStore {
    startLoading(loadingText: string | null, shadowBackground: boolean): any;
    stopLoading(): any;
    goToState(stateName: string, params?: any, url?: string | null): any;
}

interface RgReactBaseServiceInterface {
    POST_METHOD: string;
    GET_METHOD: string;
    DEFAULT_ERROR_MESSAGE: object;
    DEFAULT_TIMEOUT: number;
    CURRENT_WIDTH: number;

    // crypto: {
    //     sha256: any
    // }

    doPromise(promise: Promise<any> | null, withoutToast: boolean): Promise<any>;

    parseErrorText(errorResponse: object | null): string;

    showToast(toastId: any): void;

    parseParamsAndConfig(method: string, params: object | null, config: object | null): ParseParamsAndConfig;

    thousandSeparator(sourceValue: number, length?: number, separator?: string): string;

    handlerOutsideClick(node: HTMLDivElement, callbackOutside: () => any, removeHandler?: boolean): any;

    promiseWithLoading(globalStore: GlobalStore | undefined, promise: Promise<any>, loadingText?: string | null, shadowBackground?: boolean): Promise<any>;

    goToState(globalStore: GlobalStore | undefined, stateName: string | null, params?: object, url?: string | null): void;

    currentWidth(resolution: number): boolean;

    callCallbackWithTimeout(field: string, callback: () => any, timeout?: number): void;

    useCallWithTimeout(field: string, entity: any, callback: () => any): void;

    usePrevious<T>(value: T): T;
}

declare const RgReactBaseService: RgReactBaseServiceInterface;

interface RgReactBaseComponentInterface {
    loading: boolean;

    getSetStateField<T>(field: string, validCallback?: (value: T) => boolean, changeCallback?: () => any): ((value?: T) => T);

    moment(date?: Date | string | number | Moment): any; 

    startOf(date: Date | string | number | null | undefined, ofString?: string): Date;

    endOf(date: Date | string | number | null | undefined, ofString?: string): Date;

    goToState(stateName: string | null, params?: object, url?: string | null): void;

    goToBlankState(stateName: string): void;

    widthXS(): boolean;

    widthXSSM(): boolean;

    widthSM(): boolean;

    widthMD(): boolean;

    currentWidth(resolution: number): boolean;

    forceUpdateHandler(): void;

    updateState<T>(value: T | null, field: string, callback?: () => any, timeout?: number): void;

    updateStateArray(array: any[], callback?: () => {}, timeout?: number): void;

    clearTimeoutPause(field: string, callback?: () => {}, timeout?: number): void;

    validateForm(field: string, isError?: boolean): void;

    allFieldValid(arrayField: Array<string>): boolean;

    promiseWithLoading(promise: Promise<any>, loadingText?: string | null, shadowBackground?: boolean): Promise<any>;
    
    promiseWithLocalLoading(promise: Promise<any>, loadingText?: string | null, shadowBackground?: boolean): Promise<any>;

    getUrlQueryObject(): object;

    getUrlQueryParam(name: string): string

    setUrlQueryParams(params: Array<string>): void;

    clearUrlQueryParams(): void;

    updateContent(firstPage?: boolean): void;

    updateEntity(id: string): void;

    createPagination(pageSize: number): void;

    updatePagination(object: object, updatePagination?: any): void;

    copyObject(object: object): object;

    showConfirmModal(title: string, message: string, confirmLabel: string, cancelLabel: string, onConfirm: () => any, onCancel?: () => any): void;

    copyAllFields(oldObject: object, newObject: object): object;

    updateScrollWrapNode(node: object): void;

    isEmailValid(email: string): boolean;

    isPasswordValid(value?: string | null): boolean;

    render(): false | JSX.Element | JSX.Element[];
}

declare class RgReactBaseComponent<P, S> extends React.Component<P, S> implements RgReactBaseComponentInterface {
    emailReg: string;
    stringReg: string;
    phoneMask: string;
    VALID_ADD: string;
    dex: number;
    DEFAULT_TIMEOUT_UPDATE: number;
    timeoutCollections: object;
    PAGE_SIZE_FOR_SEARCH: number;
    MAX_WIDTH_FOR_XS: number;
    MAX_WIDTH_FOR_SM: number;
    scrollWrapNode: object;
    loading: boolean;

    getSetStateField<T>(field: string, validCallback?: (value: T) => boolean, changeCallback?: () => any): ((value?: T) => T);

    moment(date?: Date | string | number | Moment): any; 

    startOf(date: Date | string | number | null | undefined, ofString?: string): Date;

    endOf(date: Date | string | number | null | undefined, ofString?: string): Date;

    goToState(stateName: string | null, params?: object, url?: string | null): void;

    goToBlankState(stateName: string): void;

    widthXS(): boolean;

    widthXSSM(): boolean;

    widthSM(): boolean;

    widthMD(): boolean;

    currentWidth(resolution: number): boolean;

    forceUpdateHandler(): void;

    updateState<T>(value: T | null, field: string, callback?: () => any, timeout?: number): void;

    updateStateArray(array: any[], callback?: () => {}, timeout?: number): void;

    clearTimeoutPause(field: string, callback?: () => {}, timeout?: number): void;

    validateForm(field: string, isError?: boolean): void;

    allFieldValid(arrayField: Array<string>): boolean;

    promiseWithLoading(promise: Promise<any>, loadingText?: string | null, shadowBackground?: boolean): Promise<any>;
    
    promiseWithLocalLoading(promise: Promise<any>, loadingText?: string | null, shadowBackground?: boolean): Promise<any>;

    getUrlQueryObject(): object;

    getUrlQueryParam(name: string): string

    setUrlQueryParams(params: Array<string>): void;

    clearUrlQueryParams(): void;

    updateContent(firstPage?: boolean): void;

    updateEntity(id: string): void;

    createPagination(pageSize: number): void;

    updatePagination(object: object, updatePagination?: any): void;

    copyObject(object: object): object;

    showConfirmModal(title: string, message: string, confirmLabel: string, cancelLabel: string, onConfirm: () => any, onCancel?: () => any): void;

    copyAllFields(oldObject: object, newObject: object): object;

    updateScrollWrapNode(node: object): void;

    isEmailValid(email: string): boolean;

    isPasswordValid(value?: string | null): boolean;

    render(): false | JSX.Element | JSX.Element[];
}
declare class RgReactBaseContainer<P, S> extends RgReactBaseComponent<P, S> {
    componentDidMount(): any;

    render(): false | JSX.Element | JSX.Element[];
}

export { RgReactBaseComponent, RgReactBaseComponentInterface, RgReactBaseContainer, RgReactBaseService };
