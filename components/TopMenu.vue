<!-- TopMenu.vue -->
<template>
    <nav id="TopMenu">
        <ul>
            <li>
                <NuxtLink to="/">Calibration</NuxtLink>
            </li>
            <li>
                <NuxtLink class="disabled" to="/">Evaluation</NuxtLink>
            </li>
            <li>
                <NuxtLink class="disabled" to="/">Validation</NuxtLink>
            </li>
            <li>
                <NuxtLink class="disabled" to="/">Forecast</NuxtLink>
            </li>
            <li>
                <NuxtLink class="disabled" to="/">Verification</NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script>
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#TopMenu {
    font-size: 20px;
    font: 20px Arial, sans-serif;

    ul {
        list-style: none;
        margin-top: 20px;
    }

    li {
        display: inline-block;
        margin-right: 20px;
        a {
            text-decoration: none;
            color: #000;
        }
        a:hover {
            text-decoration: underline;
            color: $ngwcp_primary1;
        }       
        a:active {
            background-color: $ngwcp_neutral1;
        }
    }

}
</style>