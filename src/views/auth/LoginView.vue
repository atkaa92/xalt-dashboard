<template>
  <h1 class="text-2xl font-semibold mb-6 text-center">Login</h1>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <input
      type="email"
      placeholder="Email"
      class="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-yellowish"
      required
    />
    <input
      type="password"
      placeholder="Password"
      class="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-yellowish"
      required
    />
    <button
      type="submit"
      class="w-full py-2 rounded bg-gray-500 text-white font-semibold hover:bg-yellowish transition"
    >
      Log in
    </button>
  </form>
</template>

<script setup lang="ts">
import { useToaster } from '@/composables/useToaster';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addToasterItem } = useToaster();

function handleLogin() {
  addToasterItem('Logged In successfully.', 'success');
  setTimeout(() => {
    router.push({ name: 'dashboard' });
  }, 2000);
}
</script>
