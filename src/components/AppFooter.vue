<template>
    <footer class="footer">
        <div>
            <b-button @click="openGitHub" variant="link" class="social-button">
                <img src="@/assets/github-mark.png" alt="GitHub">
            </b-button>
            <b-button @click="openTelegram" variant="link" class="social-button">
                <img src="@/assets/telegram-logo.png" alt="Telegram">
            </b-button>
        </div>
        Version: {{ appVersion }}
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    methods: {
        openGitHub() {
            window.open('https://github.com/KonH/serbian-playground', '_blank');
        },
    
        openTelegram() {
            window.open('https://t.me/serbian_playground', '_blank');
        },
    },
    computed: {
        ...mapGetters(['appVersion'])
    }
});
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 10px;
  text-align: center;
}

.social-button img {
  width: 40px;
  height: auto;
}
</style>