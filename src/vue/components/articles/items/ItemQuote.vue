<template>
    <div class="foxy-quote-item px-0 px-lg-3 px-xl-4 mx-auto">
        <!-- Quote Balloon -->
        <div v-if="quote"
             class="foxy-quote-balloon">
            <div class="triangle"/>

            <p class="text-muted text-2 mt-2 px-3">
                <i class="fa fa-quote-left me-2 text-primary"/>
                <span v-html="parsedQuote"/>
                <i class="fa fa-quote-right ms-2 text-primary"/>
            </p>
        </div>

        <!-- Avatar -->
        <ImageView :src="props.image"
                   :alt="props.title"
                   class="foxy-quote-avatar"/>

        <!-- Texts And Links -->
        <div class="foxy-quote-about">
            <h4 class="my-3 mt-2 mt-xxl-3 mb-1"
                v-html="parsedTitle"/>

            <p class="text-muted text-4 fw-bold mb-2 pb-1"
               v-html="role"/>

            <SocialLinks v-if="props.links"
                         :items="props.links"
                         size="2"
                         variant="black"/>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue"
import {useUtils} from "/src/composables/utils.js"
import ImageView from "/src/vue/components/generic/ImageView.vue"
import SocialLinks from "/src/vue/components/widgets/SocialLinks.vue"

const utils = useUtils()

const props = defineProps({
    title: String,
    role: String,
    image: String,
    quote: String,
    links: Array
})

const parsedTitle = computed(() => {
    return utils.parseCustomText(props.title)
})

const parsedQuote = computed(() => {
    return utils.parseCustomText(props.quote)
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

$balloon-color: lighten($primary, 46%);

div.foxy-quote-item {
    min-width: 80%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
}

div.foxy-quote-avatar {
    @include generate-dynamic-styles-with-hash((
        xxxl: (height: 170px),
        xxl:  (height: 150px),
        xl:   (height: 145px),
        lg:   (height: 140px),
        md:   (height: 130px),
        sm:   (height: 110px)
    ));

    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 100%;
    border: 6px $balloon-color solid;
}

div.foxy-quote-balloon {
    --height: clamp(130px, 18.5vh, 150px);
    --padding: 0.5rem;

    @include media-breakpoint-down(sm) {
        --height: 130px;
        --padding: 0.25rem;
    }

    display: flex;
    justify-content: center;
    align-items: center;

    height: var(--height);
    overflow: hidden;
    padding: var(--padding);
    margin-bottom: 1.5rem;

    background-color: $balloon-color;
    border-radius: 20px;

    .triangle {
        position: absolute;
        margin-top: calc(var(--height) + 10px);
        width: 0;
        height: 0;

        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid $balloon-color;
    }
}
</style>