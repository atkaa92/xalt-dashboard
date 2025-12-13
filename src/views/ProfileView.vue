<template>
  <section class="flex flex-col gap-6">
    <!-- Page Header -->

    <!-- Profile Card -->
    <div class="rounded-xl bg-white/5 shadow-sm overflow-hidden text-fg max-w-2xl mx-auto w-full">
      <!-- Header Section -->
      <div
        class="bg-gradient-to-r from-slate-900/80 to-slate-900/40 px-5 py-6 backdrop-blur-sm flex justify-between items-center"
      >
        <div class="flex items-center space-x-6">
          <div
            class="w-20 h-20 rounded-full bg-button flex items-center justify-center text-3xl font-bold text-yellowish shadow-lg border-2 border-white/10"
          >
            {{ authStore.user?.firstName?.charAt(0) || 'U'
            }}{{ authStore.user?.lastName?.charAt(0) || '' }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-fg tracking-tight">
              {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
            </h2>
            <p class="text-yellowish/80 font-medium text-base mt-0.5">
              {{ authStore.user?.role || 'User' }}
            </p>
          </div>
        </div>
        <BaseButton @click="openEditModal" class="flex items-center gap-2 text-yellowish">
          Edit Profile
        </BaseButton>
      </div>

      <!-- Profile Details -->
      <div class="p-6 grid grid-cols-1 gap-6">
        <!-- First Name -->
        <div class="p-4 rounded-lg bg-white/5 border border-white/5">
          <label class="block text-xs font-medium text-muted mb-1">First Name</label>
          <p class="text-sm text-fg">{{ authStore.user?.firstName || 'Not provided' }}</p>
        </div>

        <!-- Last Name -->
        <div class="p-4 rounded-lg bg-white/5 border border-white/5">
          <label class="block text-xs font-medium text-muted mb-1">Last Name</label>
          <p class="text-sm text-fg">{{ authStore.user?.lastName || 'Not provided' }}</p>
        </div>

        <!-- Email -->
        <div class="p-4 rounded-lg bg-white/5 border border-white/5">
          <label class="block text-xs font-medium text-muted mb-1">Email Address</label>
          <p class="text-sm text-fg break-all">{{ authStore.user?.email || 'Not provided' }}</p>
        </div>

        <!-- User ID -->
        <div class="p-4 rounded-lg bg-white/5 border border-white/5">
          <label class="block text-xs font-medium text-muted mb-1">User ID</label>
          <div class="flex items-center gap-2">
            <span class="text-sm text-fg font-mono">{{ authStore.user?.id || 'N/A' }}</span>
          </div>
        </div>

        <!-- Subdomain -->
        <div
          v-if="authStore.user?.subdomain"
          class="p-4 rounded-lg bg-white/5 border border-white/5"
        >
          <label class="block text-xs font-medium text-muted mb-1">Subdomain</label>
          <p class="text-sm text-fg">{{ authStore.user.subdomain }}</p>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      :show="showEditModal"
      @close="closeEditModal"
      @success="handleProfileUpdated"
    />
  </section>
</template>

<script setup lang="ts">
import EditProfileModal from '@/components/modals/EditProfileModal.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const showEditModal = ref(false);

function openEditModal() {
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
}

function handleProfileUpdated() {
  closeEditModal();
}
</script>
