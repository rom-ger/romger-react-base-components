import React from 'react';
import RomgerReactBaseComponent from './baseComponent';

class RomgerReactBaseContainer extends RomgerReactBaseComponent {
    constructor(props) {
        super(props);
        this.checkResize();
    }

    componentWillUnmount() {
        if (typeof window === 'undefined') {
            return;
        }
        window.removeEventListener('resize', this.checkResizeCallback);
    }

    /**
     * Сохранять ширину при изменении экрана
     */
    checkResize() {
        if (typeof window === 'undefined') {
            return;
        }
        window.addEventListener('resize', this.checkResizeCallback);
    }
    /**
     * Сохранять ширину при изменении экрана
     */
    checkResizeCallback = () => {
        this.forceUpdate();
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default RomgerReactBaseContainer;