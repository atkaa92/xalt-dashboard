<template>
  <h1 class="text-2xl font-semibold mb-6 text-center">Login</h1>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <BaseInput v-model="form.email" type="email" placeholder="Email" :error="errors.email" />
    <BaseInput
      v-model="form.password"
      type="password"
      placeholder="Password"
      :error="errors.password"
    />
    <BaseButton
      type="submit"
      class="w-full py-2 rounded bg-gray-500 text-white font-semibold hover:bg-yellowish transition"
    >
      Log in
    </BaseButton>

    <div class="text-center text-sm text-gray-400 mt-4">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="text-yellowish hover:underline"
        >Register</RouterLink
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { BaseButton, BaseInput } from '@/components/ui';
import { useToaster } from '@/composables/useToaster';
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addToasterItem } = useToaster();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive<Record<string, string>>({});

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  return isValid;
}

async function handleLogin() {
  if (!validate()) {
    addToasterItem('Please check the form for errors.', 'error');
    return;
  }

  try {
    await authStore.login({ email: form.email, password: form.password });
    addToasterItem('Logged In successfully.', 'success');
    router.push({ name: 'dashboard' });
  } catch {
    addToasterItem(authStore.error || 'Login failed', 'error');
  }
}
</script>
