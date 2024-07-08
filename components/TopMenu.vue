<!-- TopMenu.vue -->
<template>
    <nav id="TopMenu">
        <ul>
            <li>
                <a to="/">Calibration</a>
            </li>
            <li>
                <a class="disabled" href="/">Evaluation</a>
            </li>
            <li>
                <a class="disabled" href="/">Validation</a>
            </li>
            <li>
                <a class="disabled" href="/">Forecast</a>
            </li>
            <li>
                <a class="disabled" href="/">Verification</a>
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