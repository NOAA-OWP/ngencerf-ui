<template>
    <nav id="TopMenu">
        <ul>
            <li>
                <NuxtLink to="/">Calibration</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/">Evaluation</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/">Validation</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/">Forecast</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/">Preferences</NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script>
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
#TopMenu {
    font-size: 28px;

    font: 28px Arial, sans-serif;

    margin-left: ul {
        list-style: none;
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