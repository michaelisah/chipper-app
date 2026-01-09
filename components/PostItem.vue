<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useFavorites } from '~/stores/favorites'
import { ref, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavorites()
const isLoading = ref(false)
const { showErrorModal } = useHelpers()

// Check if the post author is in favorites
const isFollowing = computed(() => {
  return favoritesStore.isUserFavorite(props.post.user.id)
})

// Toggle follow status
async function toggleFollow() {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    await favoritesStore.toggleUserFavorite(props.post.user.id)
  } catch (error) {
    showErrorModal(error, 'Failed to update follow status. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button 
        class="font-medium text-sm px-2 rounded-full"
        :class="isFollowing ? 'bg-red-200 text-red-500' : 'bg-blue-200 text-blue-500'"
        :disabled="isLoading"
        @click="toggleFollow">
        {{ isLoading ? 'Processing...' : (isFollowing ? 'Unfollow' : 'Follow') }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <HeartIcon
        class="h-6 stroke-current" />
      <span class="font-bold">
        Add to my favorites
      </span>
    </button>
  </div>
</template>