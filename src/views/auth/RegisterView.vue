<template>
  <h1 class="text-2xl font-semibold mb-6 text-center">Register</h1>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div class="flex space-x-4">
      <div class="w-1/2">
        <BaseInput
          v-model="form.firstname"
          label="First Name"
          placeholder="First Name"
          :error="errors.firstname"
        />
      </div>

      <div class="w-1/2">
        <BaseInput
          v-model="form.lastname"
          label="Last Name"
          placeholder="Last Name"
          :error="errors.lastname"
        />
      </div>
    </div>

    <BaseInput
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="Email"
      :error="errors.email"
    />

    <BaseSelect v-model="form.role" label="Role" :options="roleOptions" :error="errors.role" />

    <BaseInput
      v-model="form.password"
      type="password"
      label="Password"
      placeholder="Password"
      :error="errors.password"
    />

    <BaseInput
      v-model="form.confirmPassword"
      type="password"
      label="Confirm Password"
      placeholder="Confirm Password"
      :error="errors.confirmPassword"
    />

    <BaseButton
      type="submit"
      class="w-full py-2 rounded bg-gray-500 text-white font-semibold hover:bg-yellowish transition"
    >
      Register
    </BaseButton>

    <div class="text-center text-sm text-gray-400 mt-4">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="text-yellowish hover:underline">Log in</RouterLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { BaseButton, BaseInput, BaseSelect } from '@/components/ui';
import { useToaster } from '@/composables/useToaster';
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addToasterItem } = useToaster();
const authStore = useAuthStore();

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
});

const roleOptions = [
  { label: 'Select Role', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

const errors = reactive<Record<string, string>>({});

function validate() {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  let isValid = true;

  if (!form.firstname.trim()) {
    errors.firstname = 'First Name is required';
    isValid = false;
  }
  if (!form.lastname.trim()) {
    errors.lastname = 'Last Name is required';
    isValid = false;
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  if (!form.role) {
    errors.role = 'Role is required';
    isValid = false;
  }
  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
}

async function handleRegister() {
  if (!validate()) {
    addToasterItem('Please check the form for errors.', 'error');
    return;
  }

  try {
    await authStore.register({
      firstName: form.firstname,
      lastName: form.lastname,
      email: form.email,
      role: form.role,
      password: form.password,
    });

    addToasterItem('Registration successful! Redirecting to login...', 'success');

    setTimeout(() => {
      router.push({ name: 'login' });
    }, 1500);
  } catch {
    addToasterItem(authStore.error || 'Registration failed', 'error');
  }
}
</script>
