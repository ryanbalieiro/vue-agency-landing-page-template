<template>
    <!-- Main Content -->
    <slot v-if="shouldSlot"/>

    <!-- Modals -->
    <ProjectModal :project="projectModalTarget"
                  @close="_onProjectModalClosed"/>
</template>

<script setup>
import {computed, inject, onMounted, watch} from "vue"
import {useRouter} from "vue-router"
import {useUtils} from "/src/composables/utils.js"
import {useLayout} from "/src/composables/layout.js"
import {useScheduler} from "/src/composables/scheduler.js"
import ProjectModal from "/src/vue/components/projects/ProjectModal.vue"

const router = useRouter()
const utils = useUtils()
const layout = useLayout()
const scheduler = useScheduler()

const loaderEnabled = inject("loaderEnabled")
const loaderActive = inject("loaderActive")
const loaderPageRefreshCount = inject("loaderPageRefreshCount")
const loaderSmoothTransitionEnabled = inject("loaderSmoothTransitionEnabled")
const projectModalTarget = inject("projectModalTarget")
const LoaderAnimationStatus = inject("LoaderAnimationStatus")
const loaderAnimationStatus = inject("loaderAnimationStatus")

const shouldSlot = computed(() => {
    return !loaderEnabled ||
        loaderAnimationStatus.value === LoaderAnimationStatus.TRACKING_PROGRESS ||
        loaderAnimationStatus.value === LoaderAnimationStatus.LEAVING
})

/**
 * @description This hook can be used to report a visit to an external analytics service.
 * Here, you can integrate Google Analytics, Mixpanel, or your own custom analytics implementation.
 */
onMounted(() => {
    // replace the implementation below with your own analytics service...
    fetch("https://admin.ryanbalieiro.com/api/analytics/mock", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            params: {
                url: utils.getRootLocation(),
                template_id: "foxy-agency"
            }
        })
    })
})

watch(() => loaderAnimationStatus.value, () => {
    if(loaderAnimationStatus.value === LoaderAnimationStatus.LEAVING) {
        const hash = window.location.hash
        const element = hash ?
            document.querySelector(hash) :
            null

        scheduler.clearAllWithTag("content-scroll")
        if(!element || !loaderEnabled) {
            window.scrollTo({top: 0, behavior: "instant"})
            return
        }

        _scrollElementIntoView(element)
    }
})

const _scrollElementIntoView = (element) => {
    const canScroll = layout.isBodyScrollEnabled()

    if(!canScroll) {
        return scheduler.schedule(() => {
            _scrollElementIntoView(element)
        }, 100, "content-scroll")
    }

    scheduler.clearAllWithTag("content-scroll")
    element.scrollIntoView({behavior: "smooth"})
}

router.beforeEach((to, from, next) => {
    if(from.name === to.name || !loaderEnabled) {
        next()
        return
    }

    const shouldIgnorePreloader = to.matched && to.matched.length ?
        !to.matched[0].props.default['shouldAlwaysPreload'] :
        false

    if(shouldIgnorePreloader) {
        next()
        window.scrollTo({top: 0, behavior: "instant"})
        return
    }

    loaderActive.value = true
    const isDifferentRoute = from && to && from.path !== to.path
    const isDifferentRouteName = from && to && from.name !== to.name

    loaderPageRefreshCount.value = isDifferentRouteName ?
        loaderPageRefreshCount.value + 1 :
        loaderPageRefreshCount.value

    loaderSmoothTransitionEnabled.value = isDifferentRoute

    setTimeout(() => {
        next()
    }, 850)
})

router.afterEach((to, from) => {
    const isDifferentRoute = from && to && from.path !== to.path
    if(!isDifferentRoute)
        return

    window.scrollTo({top: 0, behavior: "smooth"})
})

const _onProjectModalClosed = () => {
    projectModalTarget.value = null
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>