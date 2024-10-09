<template>
     <div class="pl-6 pr-2 pt-2">
        
        <div class="flex mt-2">
            <div class="w-2/3">     
                <label for="ParamsVsIteration" class="pr-2 pt-3">Display:</label>
                <!--TO-DO: this is a placeholder for the button that needs to be added-->
                <div class="inline-block w-2/3">
                    <Select id="ParamsVsIteration" class="p-select">
                        <option value="">...</option>
                    </Select>
                </div>
            </div>
            <div class="ml-auto mt-2">
                <!--TO-DO: this is supposed to be a conditional display-->
                <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button>New Validation</button></span>
            </div>
        </div>
        
        <div class="text-center">
            <div id="ScatterPlots">
                <img alt="TO-DO: put here the detailed desctioption of what is it in the image OR privide an alternative non-graphical version of the content currently represented in the image that people could read through (thats for for 508 Compliency)" src="@/assets/styles/img/scatterplots.png" width="80%">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#ScatterPlots img {
    margin: 20px auto;
}
</style>