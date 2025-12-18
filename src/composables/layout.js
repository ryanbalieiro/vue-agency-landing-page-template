/**
 * Created by Ryan Balieiro on 08.26.2023
 * This composable will implement helper methods that manipulate DOM elements.
 */
import {useUtils} from "/src/composables/utils.js"

const utils = useUtils()

export function useLayout() {
    /**
     * @param {Boolean} enabled
     */
    const setBodyScrollEnabled = (enabled) => {
        window.__scrollEnabled = enabled

        if(!enabled) {
            document.body.style.position = 'fixed'
            document.body.style.top = `0px`
            document.body.style.left = '0'
            document.body.style.right = '0'
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'
        }
        else {
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.left = ''
            document.body.style.right = ''
            document.body.style.width = ''
            document.body.style.overflow = ''
        }
    }

    /**
     * @return {Boolean}
     */
    const isBodyScrollEnabled = () => {
        if(window.__scrollEnabled === undefined) window.__scrollEnabled = true
        return window.__scrollEnabled
    }

    /**
     * @param {HTMLElement} element
     * @return {boolean}
     */
    const isElementOutsideBounds = (element) => {
        const rect = element.getBoundingClientRect()

        return (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top > window.innerHeight
        )
    }

    /**
     * @param {HTMLElement} element
     * @return {boolean}
     */
    const scrollIntoView = (element) => {
        const elNavbar = document.querySelector('.foxy-navbar-compressed')
        const navOffset = elNavbar ? elNavbar.getBoundingClientRect().height - 2 : 70

        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition - navOffset

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    return {
        setBodyScrollEnabled,
        isBodyScrollEnabled,
        isElementOutsideBounds,
        scrollIntoView
    }
}