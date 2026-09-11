<template>
    <div class="_help-page">
        <div class="_help-title">Download ngenCERF CLI</div>
        <p id="help-subtitle" class="_help-subtitle">
        </p>
        <hr class="my-6 border-black" />
        <p class="text-center font-medium">
            The ngenCERF CLI lets you run jobs and interact with the server directly from your local machine.
        </p>
        <hr class="my-6 border-black" />

        <div class="ml-2">
            <!-- Download CLI page details -->
            <div class="space-y-4">
                <p><strong>1. Download the CLI</strong></p>
                <p>
                    Choose the download that matches your operating system: <strong>Windows</strong>
                    (<code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngenCerf.exe</code>),
                    <strong>MacOS</strong>, or <strong>Linux</strong> (both distributed as
                    <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngenCerf</code>).
                </p>

                <p><strong>2. Installation &amp; Usage</strong></p>
                <p class="text-sm text-gray-700">
                    The setup steps are slightly different depending on your platform.
                </p>
                <ul class="list-disc list-outside space-y-2 ml-6">
                    <li>
                        <strong>Windows</strong>
                        <div class="text-sm text-gray-700 mt-1">
                            Save <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngenCerf.exe</code>
                            in a directory where you want to keep command-line tools, such as
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">C:\Users\&lt;your-username&gt;\bin</code>.
                            You can run it directly from that directory using
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">.\ngencerf.exe</code>,
                            or optionally add that directory to your Windows <strong>PATH</strong> so you can run it
                            from anywhere using <strong>ngencerf</strong>.
                        </div>
                    </li>
                    <li>
                        <strong>MacOS</strong>
                        <div class="text-sm text-gray-700 mt-1">
                            Open Terminal in the download directory and make the file executable using
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">chmod +x ngencerf</code>.
                            You can then run it directly from that directory using
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">./ngencerf</code>,
                            or optionally move it to a directory on your <strong>PATH</strong>, such as
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">/usr/local/bin</code>,
                            so you can run it from anywhere using <strong>ngencerf</strong>.
                        </div>
                    </li>
                    <li>
                        <strong>Linux</strong>
                        <div class="text-sm text-gray-700 mt-1">
                            Open a terminal in the download directory and make the file executable using
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">chmod +x ngencerf</code>.
                            You can then run it directly from that directory using
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">./ngencerf</code>,
                            or optionally move it to a directory on your <strong>PATH</strong>, such as
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">/usr/local/bin</code>,
                            so you can run it from anywhere using <strong>ngencerf</strong>.
                        </div>
                    </li>
                </ul>

                <p><strong>3. Configure the Server URL</strong></p>
                <p>
                    Before using the CLI, tell it which server to connect to:
                </p>
                <ul class="list-disc list-outside space-y-2 ml-6">
                    <li>
                        <span class="text-sm text-gray-700">For Example:</span>
                        <div class="text-sm text-gray-700 mt-1">
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngencerf url add https://ngencerf-ea.nextgenwaterprediction.com/api</code>
                        </div>
                    </li>
                    <li>
                        <span class="text-sm text-gray-700">
                            The CLI saves this URL and uses it for future commands. You can save multiple server
                            URLs — the most recently added one becomes the active server.
                        </span>
                    </li>
                    <li>
                        <span class="text-sm text-gray-700">To display your saved servers:</span>
                        <div class="text-sm text-gray-700 mt-1">
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngencerf url list</code>
                        </div>
                    </li>
                    <li>
                        <span class="text-sm text-gray-700">To switch to another saved server:</span>
                        <div class="text-sm text-gray-700 mt-1">
                            <code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">ngencerf url select &lt;number&gt;</code>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
