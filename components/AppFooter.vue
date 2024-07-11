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
@import "/assets/styles/styles.scss";

#Footer {
    font: 18px NeueFrutigerWorld-Book, sans-serif;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    color: #fff;
    z-index: 9999;
    background-color: $ngwcp_primary3;
   
}


.topBar {
    background-color: #156191;
    height: 4px;
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