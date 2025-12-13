<template>
  <BaseModal v-model="isOpen" title="Edit Profile">
    <form @submit.prevent="handleSubmit" class="space-y-4 text-fg">
      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded"
      >
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded"
      >
        {{ errorMessage }}
      </div>

      <!-- First Name -->
      <BaseInput
        v-model="formData.firstName"
        label="First Name"
        type="text"
        placeholder="Enter your first name"
        :error="errors.firstName"
        required
      />

      <!-- Last Name -->
      <BaseInput
        v-model="formData.lastName"
        label="Last Name"
        type="text"
        placeholder="Enter your last name"
        :error="errors.lastName"
        required
      />

      <!-- Email -->
      <BaseInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        :error="errors.email"
        required
      />

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <BaseButton
          type="button"
          @click="isOpen = false"
          class="px-4 py-2 border border-white/10 rounded hover:bg-white/5 text-muted transition-colors"
          :disabled="isSubmitting"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          class="px-4 py-2 bg-button text-yellowish rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import { useAuthStore } from '@/stores/auth';
import type { UpdateProfileRequest } from '@/types';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const authStore = useAuthStore();

// Computed property for v-model
const isOpen = computed({
  get: () => props.show,
  set: (value: boolean) => {
    if (!value) {
      emit('close');
    }
  },
});

// Form fields
const formData = ref<UpdateProfileRequest>({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
});

// Validation errors
const errors = ref<Record<string, string>>({});

// Success/error messages
const successMessage = ref('');
const errorMessage = ref('');

const isSubmitting = computed(() => authStore.loading);

// Validate form
function validateForm(): boolean {
  errors.value = {};

  if (!formData.value.firstName?.trim()) {
    errors.value.firstName = 'First name is required';
  }

  if (!formData.value.lastName?.trim()) {
    errors.value.lastName = 'Last name is required';
  }

  if (!formData.value.email?.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email';
  }

  return Object.keys(errors.value).length === 0;
}

// Handle form submission
async function handleSubmit() {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    await authStore.updateProfile({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
    });

    successMessage.value = 'Profile updated successfully!';

    // Emit success event after a short delay to show the message
    setTimeout(() => {
      emit('success');
      emit('close');
    }, 1500);
  } catch {
    errorMessage.value = authStore.error || 'Failed to update profile';
  }
}

// Reset form when modal opens
function resetForm() {
  formData.value = {
    firstName: authStore.user?.firstName || '',
    lastName: authStore.user?.lastName || '',
    email: authStore.user?.email || '',
  };
  errors.value = {};
  successMessage.value = '';
  errorMessage.value = '';
}

// Watch for modal opening to reset form
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  },
);
</script>
