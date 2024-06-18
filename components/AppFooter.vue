<template>
    <div id="Footer">
        <div class="topBar">&nbsp</div>
        <div class="version">
            Version {{ info.program_info.version }},&nbsp;&nbsp;{{ info.program_info.release_date }}
        </div>
        <div class="copyright">
            Copyright &COPY;, Somebody
        </div>

    </div>
</template>

<script lang="ts" setup>
import json from "@/assets/versionInfo.json";
const info = json;

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#Footer {
    font: 18px Roboto, sans-serif;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    color: #fff;
}

.topBar {
    background-color: $ngwcp_primary3;
    height: 5px;
}

.version,
.copyright {
    display: block;
    margin-top: 10px;
}

.version {
    float: left;
    margin-left: 20px;
}

.copyright {
    float: right;
    margin-right: 20px;
}
</style>